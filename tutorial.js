/**
 * A WebGL component that takes in a WebGL context and a color and
 * draws that color over the entire canvas.
 *
 * You'd usually do more than just drawing a single color. We're
 * keeping it simple here since we're only trying to learn how to
 * unit test our canvas.
 *
 * For a more involved component example - here's one that I use to render
 * 3d skeletal animations
 *  - https://github.com/chinedufn/load-collada-dae
 */
function drawBackground (gl, color) {
  gl.clearColor(color[0], color[2], color[2], 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

/**
 * We make a quick little function that lets us save a WebGL canvas'
 * contents to our file system as an image. By doing this, we can
 * verify that they contents of our canvas match what we expect.
 *
 * In a real component, you'd first save your results to an image
 * and manually inspect it to verify that you're seeing the correct
 * results. You'd then use that image as your expected results for your
 * tests. As time goes on and you update your code, your test will
 * verify that you are still rendering that exact same image.
 */
function saveCanvasToImage (gl, width, height, filepath) {
  var fs = require('fs')
  var path = require('path')
  var webGlToImgStream = require('webgl-to-img-stream')
  var outputFileStream = fs.createWriteStream(
    path.resolve(__dirname, filepath)
  )
  webGlToImgStream(gl, width, height, outputFileStream)
}

/**
 * We create a WebGL context that we'll later pass into our component
 * so that our component can draw onto it
 */
var canvasWidth = 64
var canvasHeight = 64
var createContext = require('gl')
var gl = createContext(canvasWidth, canvasHeight)
gl.viewport(0, 0, canvasWidth, canvasHeight)

/**
 * Pass our WebGL context and some data to our component.
 * Our component will paint the canvas with the color that
 * we passed in.
 */
drawBackground(gl, [1, 0, 0])

/**
 * Now that we've drawn to our canvas, save it as our expected
 * image result. Later in our test we'll try to re-produce this
 */
saveCanvasToImage(gl, canvasWidth, canvasHeight, './expected.png')

/**
 * NOTE!! Evertyhing below here would typically go into a separate test file.
 * Keeping it all in here to (hopefully) keep this tutorial simple.
 */

/**
 * Test that our component works. See if you can change
 * `drawBackground(gl, [1, 0, 0])` down below, or you
 * change the implementation function drawBackground
 * above to make the tests fail
 */
var test = require('tape')
var imageDiff = require('image-diff')
test(function (t) {
  t.plan(1)

  drawBackground(gl, [1, 0, 0])
  saveCanvasToImage(gl, canvasWidth, canvasHeight, './actual.png')

  /**
   * Compare the image that we just created to the image that we're
   * expecting to have created.
   */
  imageDiff({
    actualImage: './actual.png',
    expectedImage: './expected.png'
  }, function (err, imagesAreSame) {
    if (err) { t.notOk(err) }
    t.ok(imagesAreSame, 'Images match')
  })
})
