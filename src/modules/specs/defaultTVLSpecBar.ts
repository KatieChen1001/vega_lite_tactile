const defaultStrokeWidth = 2; // default stroke width

const defaultBrailleFont = "Swell Braille";
const defaultBrailleFontSize = 29;

const defaultXAxisTitlePadding = 20;
const defaultTickLength = 10;

const defaultLegendTitlePadding = 20; // distance between legend title and legend labels
const defaultLegendPadding = 60 // distance between bottom of legend and top of chart 
// probably don't want to hardcode this 
// [TODO] get y position of y axis title, 
// y position of lengend + lengend height, maybe set padding to the difference?? 
const defaultLegendSymbolSize = 3000;  // size of the legend symbols
const defaultLegentColumnPadding = 20; // distance between legend columns
const defaultLegendRowPadding = 20; // distance between legend rows

const defaultGridWidth = 1; // default grid width

const defaultTitleYOffset = -10; // default title y offset (distance from axis)

export const defaultTVLSpecBar = {
    "encoding": {
        "x": {
            "axis": {
                "grid": false,
                "ticks": false,
                "titlePadding": defaultXAxisTitlePadding,
                "labelAngle": 0
            }
        },
        "y": {
            "axis": {
                "grid": true,
                "gridWidth": defaultGridWidth,
                "gridColor": "black",
                "titleAlign": "left",
                "titleAngle": 0,
                "titleAnchor": "end",
                "titleY": defaultTitleYOffset
            }
        }
    },
    // config
    "config": {
        "background": "white",
        "view": {
            "stroke": "black",
            "strokeWidth": defaultStrokeWidth
        },
        "title": {
            "font": defaultBrailleFont,
            "fontSize": defaultBrailleFontSize,
        },
        "mark": {
            "stroke": "black",
            "strokeWidth": defaultStrokeWidth
        },
        "axis": {
            "labelFont": defaultBrailleFont,
            "labelFontSize": defaultBrailleFontSize,
            "labelAngle": 0,
            "titleFont": defaultBrailleFont,
            "titleFontSize": defaultBrailleFontSize,
            "tickSize": defaultTickLength,
            "tickColor": "black",
            "tickWidth": defaultStrokeWidth,
            "domainColor": "black"
        },
        "legend": {
            "labelFont": defaultBrailleFont,
            "labelFontSize": defaultBrailleFontSize,
            "titleFont": defaultBrailleFont,
            "titleFontSize": defaultBrailleFontSize,
            "titlePadding": defaultLegendTitlePadding,
            "direction": "vertical",
            "orient": "top",
            "padding": defaultLegendPadding,
            "symbolSize": defaultLegendSymbolSize,
            "columnPadding": defaultLegentColumnPadding,
            "rowPadding": defaultLegendRowPadding
        },
        "scale": {
            "barBandPaddingInner": 0.2,
        }
    }
}
