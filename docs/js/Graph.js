class Graph {
  constructor(graphConfiguration, id) {
    // hey, source code viewer! play around with some variables
    // don't you forget to give me credits if you use my code...welp!

    // rendering stuff
    var scalingFactor;
    const graphScalingFactor = 0.92, aspectRatio = 2;
    var lastDarkMode = darkMode;

    // keep these low to accomodate space for headings, legends, labels, .........perhaps my name
    const xAxisScalingFactor = 0.96, yAxisScalingFactor = 0.8;

    var displayPerDayData = true;

    // others
    const textSize = 80;
    var graphDrawn, lastMouseMovementTimeMillis, stopDrawing = false, showInformationBox = true;
    var informationBoxX, informationBoxY, informationBoxTargetX, informationBoxTargetY, informationBoxThresholdDistance = 8, informationBoxLerpFactor = 0.1;

    // new p5(sketch, id);
    this.sketch = new p5((sketch) => {
      // setup the canvas
      sketch.setup = () => {
        // strip out the dimensions of my parent
        let element = document.getElementById(sketch.canvas.parentElement.id);  // or id
        let rect = element.getBoundingClientRect();
        let x = rect.left, y = rect.top, w = (rect.right - rect.left), h = (rect.bottom - rect.top);

        sketch.createCanvas(w, w / aspectRatio);
        sketch.frameRate(60);

        // do some stuff
        doRenderingSetup();

        // yay, use this font - it looks good
        // if we found it
        sketch.textFont('Waiting for the Sunrise');
      };

      // everything is in here, all the drawing/rendering stuff (it can be done elsewhere, but who cares, keep it simple)
      // We will...we will...draw you!
      // We will...we will...draw you!
      // We will...we will...draw you!
      // ...a graph
      sketch.draw = () => {
        // this is temporary, rendering is stopped after inactivity (see below, somewhere)
        if (stopDrawing && lastDarkMode == darkMode) {
          return;
        }
        else {
          lastDarkMode = darkMode;
        }

        //console.log(sketch.canvas.parentElement.id, sketch.frameCount);

        // removing the background - sketch.clear()
        // then in CSS using border-radius: ...; works!
        // or we can use 'clip', to clip the corners and make them round
        // it is easier to control in here

        // translate the canvas' origin to the center
        sketch.translate(sketch.width / 2, sketch.height / 2);
        sketch.noStroke();
        sketch.fill(sketch.abs((darkMode ? 0 : 255) - 32));
        sketch.rectMode(sketch.CENTER);
        sketch.rect(0, 0, sketch.width, sketch.height, 32 * scalingFactor);

        sketch.textAlign(sketch.CENTER, sketch.CENTER);

        // Aw snap!!
        if (dataError) {
          sketch.fill(255, 0, 0);
          // yeah! `backticks` - command injection XD
          sketch.text(`Oops!\n${errorMessage}\nTap to retry`, 0, 0);

          // stop rendering
          sketch.noLoop();
        }
        else if (dataFetched) {
          // fetch...fetch...fetch...spider man!
          // oh, doesn't it sound like that?

          if (dataCrunched) {
            // yum..yumm..yummy!!

            let titleTextWidth = sketch.textWidth(graphConfiguration.title);
            sketch.fill(darkMode ? 255 : 0);
            sketch.text(graphConfiguration.title, 0, -sketch.height / 2 + textSize * scalingFactor);

            sketch.stroke(darkMode ? 255 : 0);
            sketch.strokeWeight(2 * scalingFactor);
            sketch.line(
              -titleTextWidth / 2, -sketch.height / 2 + textSize * scalingFactor + sketch.textDescent() / 2,
              +titleTextWidth / 2, -sketch.height / 2 + textSize * scalingFactor + sketch.textDescent() / 2
            );

            if (isChangeDisplayModeButtonHover()) {
              sketch.fill(128, 192);
            }
            else {
              sketch.fill(darkMode ? 0 : 255, 192);
            }

            sketch.rectMode(sketch.CENTER);
            sketch.rect(
              sketch.width / 2 - textSize * scalingFactor * 2.4, -sketch.height / 2 + textSize * scalingFactor * 0.8,
              textSize * scalingFactor * 4, textSize * scalingFactor, textSize * scalingFactor
            );

            sketch.noStroke();
            sketch.fill(darkMode ? 255 : 0);
            sketch.text(
              displayPerDayData ? 'per-day' : 'total',
              sketch.width / 2 - textSize * scalingFactor * 2.4,
              -sketch.height / 2 + textSize * scalingFactor
            );

            // nah, we aren't doing any `assembly` stuff here!!! - push esp...ret
            sketch.push();

            // flip the y-axis so that we follow normal graph directions
            // +x goes right, +y goes up
            sketch.scale(graphScalingFactor, -graphScalingFactor);

            sketch.noStroke();
            sketch.strokeWeight(4 * scalingFactor);
            sketch.fill(sketch.red(graphConfiguration.color), sketch.green(graphConfiguration.color), sketch.blue(graphConfiguration.color), 64);
            sketch.beginShape();

            // starting point
            if (displayPerDayData) {
              sketch.vertex(
                -sketch.width * xAxisScalingFactor * 0.5,
                (data[0][graphConfiguration.key].delta / metadata[graphConfiguration.key].deltaMax - 0.5) * sketch.height * yAxisScalingFactor
              );
            }
            else {
              sketch.vertex(
                -sketch.width * xAxisScalingFactor * 0.5,
                (data[0][graphConfiguration.key].total / metadata[graphConfiguration.key].total - 0.5) * sketch.height * yAxisScalingFactor
              );
            }

            // sketch.curveVertex and sketck.bezierVertex weren't working as needed
            // they allowed the `y coords` to go negative

            // taken from GeeksforGeeks, modifed as per needs
            var m, dx1 = 0, dy1 = 0, dx2, dy2;
            const f = 0.2, t = 0.4;

            var prevX, prevY, currX, currY, nextX, nextY;

            if (displayPerDayData) {
              prevX = -sketch.width * xAxisScalingFactor * 0.5;
              prevY = (data[0][graphConfiguration.key].delta / metadata[graphConfiguration.key].deltaMax - 0.5) * sketch.height * yAxisScalingFactor;
            }
            else {
              prevX = -sketch.width * xAxisScalingFactor * 0.5;
              prevY = (data[0][graphConfiguration.key].total / metadata[graphConfiguration.key].total - 0.5) * sketch.height * yAxisScalingFactor;
            }

            for (var i = 1; i < data.length; i += skipLength) {
              currX = (i / (data.length - 1) - 0.5) * sketch.width * xAxisScalingFactor;

              if (displayPerDayData) {
                currY = (data[i][graphConfiguration.key].delta / metadata[graphConfiguration.key].deltaMax - 0.5) * sketch.height * yAxisScalingFactor;
              }
              else {
                currY = (data[i][graphConfiguration.key].total / metadata[graphConfiguration.key].total - 0.5) * sketch.height * yAxisScalingFactor;
              }

              if (i < data.length - 1) {
                nextX = ((i + 1) / (data.length - 1) - 0.5) * sketch.width * xAxisScalingFactor;

                if (displayPerDayData) {
                  nextY = (data[i + 1][graphConfiguration.key].delta / metadata[graphConfiguration.key].deltaMax - 0.5) * sketch.height * yAxisScalingFactor;
                }
                else {
                  nextY = (data[i + 1][graphConfiguration.key].total / metadata[graphConfiguration.key].total - 0.5) * sketch.height * yAxisScalingFactor;
                }

                m = (nextY - prevY) / (nextX - prevX);
                dx2 = (nextX - currX) * -f;
                dy2 = dx2 * m * t;
              }
              else {
                dx2 = dy2 = 0;
              }

              sketch.bezierVertex(
                prevX - dx1, sketch.max(prevY - dy1, -sketch.height * yAxisScalingFactor * 0.5),
                currX + dx2, sketch.max(currY + dy2, -sketch.height * yAxisScalingFactor * 0.5),
                currX, currY
              );

              dx1 = dx2;
              dy1 = dy2;
              prevX = currX;
              prevY = currY;
            }

            if (displayPerDayData) {
              sketch.vertex(
                sketch.width * xAxisScalingFactor * 0.5,
                -0.5 * sketch.height * yAxisScalingFactor
              );
            }
            else {
              sketch.vertex(
                sketch.width * xAxisScalingFactor * 0.5,
                -0.5 * sketch.height * yAxisScalingFactor
              );
            }

            sketch.endShape(sketch.CLOSE);

            // use a darker (pale) color
            sketch.stroke(sketch.red(graphConfiguration.color) * 0.8, sketch.green(graphConfiguration.color) * 0.8, sketch.blue(graphConfiguration.color) * 0.8);
            sketch.strokeWeight(8 * scalingFactor);
            sketch.noFill();

            sketch.beginShape();
            for (let i = 0; i < sampledData.length; i++) {
              if (displayPerDayData) {
                sketch.vertex(
                  (i / (sampledData.length - 1) - 0.5) * sketch.width * xAxisScalingFactor,
                  (sampledData[i][graphConfiguration.key].delta / metadata[graphConfiguration.key].deltaMax - 0.5) * sketch.height * yAxisScalingFactor
                );
              }
              else {
                sketch.vertex(
                  (i / (sampledData.length - 1) - 0.5) * sketch.width * xAxisScalingFactor,
                  (sampledData[i][graphConfiguration.key].total / metadata[graphConfiguration.key].total - 0.5) * sketch.height * yAxisScalingFactor
                );
              }
            }
            sketch.endShape();

            // draw the axes
            sketch.stroke(darkMode ? 255 : 0);
            sketch.strokeWeight(4 * scalingFactor);
            sketch.line(-sketch.width * 0.5, -sketch.height * yAxisScalingFactor * 0.5, sketch.width * 0.5, -sketch.height * yAxisScalingFactor * 0.5);
            sketch.line(-sketch.width * xAxisScalingFactor * 0.5, -sketch.height * 0.5, -sketch.width * xAxisScalingFactor * 0.5, sketch.height * 0.5);

            if (showInformationBox && isMouseHover()) {
              const position = getPositionOnGraph();

              if (!informationBoxX) {
                informationBoxX = position.x;
                informationBoxY = position.y;
              }
              else {
                // slide...weeeeeeeeee....oh shit!
                // this should be time dependent like `alpha * frameTime`, but anyway
                informationBoxX += (informationBoxTargetX - informationBoxX) * informationBoxLerpFactor;
                informationBoxY += (informationBoxTargetY - informationBoxY) * informationBoxLerpFactor;
              }

              informationBoxTargetX = position.x;
              informationBoxTargetY = position.y;

              sketch.strokeWeight(4 * scalingFactor);
              sketch.stroke(darkMode ? 255 : 0);

              const startY = -sketch.height * yAxisScalingFactor * 0.5, endY = position.y, dY = 10 * scalingFactor;
              var Y = startY;

              while (Y < endY) {
                sketch.line(position.x, Y, position.x, sketch.min(Y + dY, endY));
                Y += 2 * dY;
              }

              sketch.noStroke();
              sketch.fill(darkMode ? 255 : 0);
              sketch.circle(position.x, position.y, 2 * 8 * scalingFactor);

              // revert the y-axis to original direction
              // otherwise the text will be displayed upside down
              sketch.scale(1, -1);

              showInformationInBox(
                (!displayPerDayData ? 'till' : 'on') + ' date: ' +
                  data[position.dataIndex].date +
                  '\n' + (!displayPerDayData ? 'total ' : '') +
                  graphConfiguration.message +
                  data[position.dataIndex][graphConfiguration.key][displayPerDayData ? 'delta' : 'total'],
                informationBoxX, informationBoxY
              );
            }
            else {
              showInformationBox = false;
            }

            // pop, ret, leave...oh crap...SIGSEGV!
            sketch.pop();

            // here we go again! - push, pop!
            sketch.push();
            sketch.textFont('Monospace');
            sketch.noStroke();
            sketch.fill(darkMode ? 255 : 0);
            sketch.textSize(textSize * scalingFactor * 0.6);
            sketch.textAlign(sketch.CENTER, sketch.CENTER);
            // can do something like longDataSour... but I know my `data source` string fits in the available space
            sketch.text(`Data source: ${dataSource}`, sketch.width * (1 - xAxisScalingFactor) / 2 * 0.5, sketch.height / 2 - sketch.height * (1 - yAxisScalingFactor) / 2 * 0.5);
            sketch.pop();

            // this is used to check if we have drawn the graph at least once or not
            graphDrawn = true;

            // if the last interaction was more than 200ms ago or if user is not interacting with this graph
            // and if the informationBox has reached its target position
            if (
              sketch.millis() - lastMouseMovementTimeMillis > 200 &&
              sketch.dist(informationBoxX, informationBoxY, informationBoxTargetX, informationBoxTargetY) < informationBoxThresholdDistance * scalingFactor
            ) {
              // simply stop drawing the frame
              stopDrawing = true;

              if (!isMouseHover()) {
                // stop rendering
                sketch.noLoop();
              }
            }
          }
          else {
            sketch.fill(darkMode ? 255 : 0);
            sketch.noStroke();
            sketch.text("Crunching data just for you..." + (crunchMessage != "" ? '\n' : '') + crunchMessage, 0, 0);
          }
        }
        else {
          sketch.fill(darkMode ? 255 : 0);
          sketch.noStroke();
          sketch.text("Fetching data..." + (fetchMessage != "" ? '\n' : '') + fetchMessage, 0, 0);
        }
      };

      sketch.windowResized = () => {
        // strip out the dimensions of my parent
        let element = document.getElementById(id);
        let rect = element.getBoundingClientRect();
        let x = rect.left, y = rect.top, w = (rect.right - rect.left), h = (rect.bottom - rect.top);

        sketch.resizeCanvas(w, w / aspectRatio);
        doRenderingSetup();

        // redraw a frame
        stopDrawing = false;
        sketch.redraw();
      };

      sketch.mouseClicked = () => {
        if (!dataError && !(dataFetched && dataCrunched)) {
          return;
        }

        if (isMouseHover()) {
          startRenderingOnMouseEvent();

          if (dataError) {
            // resume rendering
            sketch.loop();

            fetchAndProcess();
          }
          else if (isChangeDisplayModeButtonHover()) {
            displayPerDayData ^= true;
          }
        }
      };

      sketch.mouseDragged = startRenderingOnMouseEvent;
      sketch.mouseMoved = startRenderingOnMouseEvent;

      function startRenderingOnMouseEvent() {
        if (!(dataFetched && dataCrunched)) {
          return;
        }

        if (isMouseHover()) {
          stopDrawing = false;
          showInformationBox = true;
          lastMouseMovementTimeMillis = sketch.millis();

          if (!dataError) {
            // resume rendering
            sketch.loop();
          }
        }
        else if (graphDrawn) {
          // stop rendering
          sketch.noLoop();
        }
      }

      function doRenderingSetup() {
        // is this a good way for scaling?
        //   -> tested in a private project, Kishan Sir knows about that one
        scalingFactor = sketch.width / 1920;
        sketch.textSize(textSize * scalingFactor);
      }

      function handleError() {
        dataError = true;
        errorMessage = "We couldn't `fetch` this data ( did you `GET` it? )";
        // you `GET` it?
        // `POST` it .then and I will .catch
        // .finally - you `GET` it or not?
        // Aw snap!! - connection refused!
      }

      function isMouseHover() {
        // return `true` when the mouse is coinciding within this sketch's outskirts
        // no not that skirts, Think Different - eat an `Apple`
        return sketch.mouseX > 0 && sketch.mouseX < sketch.width && sketch.mouseY > 0 && sketch.mouseY < sketch.height;
      }

      function isChangeDisplayModeButtonHover() {
        // return `true` when the mouse is coinciding within the given button
sketch.width / 2 - textSize * scalingFactor * 2.4, -sketch.height / 2 + textSize * scalingFactor * 0.8, textSize * scalingFactor * 4, textSize *
    scalingFactor, textSize * scalingFactor

        return sketch.mouseX > sketch.width - textSize * scalingFactor * 4.4 &&
               sketch.mouseX < sketch.width - textSize * scalingFactor * 0.4 &&
               sketch.mouseY > textSize * scalingFactor * 0.3 &&
               sketch.mouseY < textSize * scalingFactor * 1.3;
      }

      function showInformationInBox(boxText, boxX, boxY) {
        // use custom textWidth and textHeight to handle '\n' characters
        const strTextWidth = getTextWidth(boxText), strTextHeight = getTextHeight(boxText),
          boxWidth = strTextWidth + 24 * scalingFactor, boxHeight = strTextHeight, boxRadius = 16 * scalingFactor, outskirtDistance = 8 * scalingFactor;

        const x = sketch.constrain(
          boxX,
          -sketch.width * xAxisScalingFactor * 0.5 + boxWidth / 2 + outskirtDistance,
          sketch.width * xAxisScalingFactor * 0.5 - boxWidth / 2 - outskirtDistance
        ), y = -sketch.constrain(
          boxY,
          -sketch.height * yAxisScalingFactor * 0.5 + boxHeight / 2 + outskirtDistance,
          sketch.height * yAxisScalingFactor * 0.5 - boxHeight / 2 - outskirtDistance
        );

        sketch.stroke(darkMode ? 255 : 0);
        sketch.strokeWeight(2 * scalingFactor);
        sketch.fill(darkMode ? 0 : 255, 192);
        sketch.rectMode(sketch.CENTER);
        sketch.rect(x, y, boxWidth, boxHeight, boxRadius);

        sketch.textAlign(sketch.LEFT, sketch.CENTER);

        sketch.noStroke();
        sketch.fill(darkMode ? 255 : 0);
        sketch.text(boxText, x - strTextWidth / 2, y);
      }

      function getPositionOnGraph() {
        var dataIndex = skipLength * Math.round(sketch.round(sketch.map((sketch.mouseX - sketch.width / 2) / graphScalingFactor, -sketch.width * xAxisScalingFactor * 0.5, sketch.width * xAxisScalingFactor * 0.5, 0, data.length - 1) / skipLength));

        // prevent floating point error from causing IndexErrors
        if (dataIndex < 0) {
          dataIndex = 0;
        }
        else if (dataIndex > data.length - 1) {
          dataIndex = data.length - 1;
        }

        var x = sketch.map(dataIndex, 0, data.length - 1, -sketch.width * xAxisScalingFactor * 0.5, sketch.width * xAxisScalingFactor * 0.5), y;

        if (displayPerDayData) {
          y = data[dataIndex][graphConfiguration.key].delta / metadata[graphConfiguration.key].deltaMax * sketch.height * yAxisScalingFactor - sketch.height * yAxisScalingFactor * 0.5;
        }
        else {
          y = data[dataIndex][graphConfiguration.key].total / metadata[graphConfiguration.key].total * sketch.height * yAxisScalingFactor - sketch.height * yAxisScalingFactor * 0.5;
        }

        return {
          'x': x,
          'y': y,
          'dataIndex': dataIndex
        };
      }

      function getTextWidth(str) {
        var pieces = str.split('\n');
        var width = 0;

        for (let index in pieces) {
          width = sketch.max(width, sketch.textWidth(pieces[index]));
        }

        return width;
      }

      function getTextHeight(str) {
        // couldn't find any way to find current textSize and textLeading
        // using custom values

        const numPieces = str.split('\n').length;
        return numPieces * textSize * scalingFactor + (numPieces - 1) * textSize / 2 * scalingFactor;
      }
    }, id);
  }
}
