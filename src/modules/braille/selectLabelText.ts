const d3 = require("d3");
import { translateBraille } from "./translateBraille";

function selectLabelText(result: any, svgSelectionCriteria: string, spec: any) {

    const axis = d3.select(result.view.container()).select("svg").selectAll(svgSelectionCriteria);
    const xAxis = axis.nodes()[0]
    const xAxisLabels = d3.select(xAxis).selectAll("text");
    const yAxis = axis.nodes()[1]
    const yAxisLabels = d3.select(yAxis).selectAll("text");

    // translate every x-axis labels to braille
    xAxisLabels.each(function (this: SVGTextElement, d: any, i: number, nodes: ArrayLike<SVGTextElement>) {
        // convert all text to lower case
        d.text = d.text.toLowerCase();
        translateBraille(d.text, (brailleText: string) => {
            const textElement = d3.select(this);
            // if the braillText has spacing in it, create a tspan element for each word and display each word on a new line
            if (brailleText.includes(" ")) {
                const words = brailleText.split(" ");
                textElement.text(null);
                words.forEach((word, index) => {
                    textElement.append("tspan")
                        .text(word)
                        .attr("x", "0")
                        .attr("dy", `${index * 1.2}em`);
                });
            } else {
                textElement.text(brailleText);
            }
            // set text-anchor to middle
            textElement.attr("text-anchor", "middle");

        });
    });

    // translate every y-axis labels to braille
    yAxisLabels.each(function (this: SVGTextElement, d: any, i: number, nodes: ArrayLike<SVGTextElement>) {
        // convert all text to lower case
        d.text = d.text.toLowerCase();
        translateBraille(d.text, (brailleText: string) => {
            const textElement = d3.select(this);
            // if the braillText has spacing in it, create a tspan element for each word and display each word on a new line
            if (brailleText.includes(" ")) {
                const words = brailleText.split(" ");
                textElement.text(null);
                words.forEach((word, index) => {
                    textElement.append("tspan")
                        .text(word)
                        .attr("x", "0")
                        .attr("dy", `${index * 1.2}em`);
                });
            } else {
                textElement.text(brailleText);
            }
            // set text-anchor to end
            textElement.attr("text-anchor", "end");

        });
    });
}

export { selectLabelText };