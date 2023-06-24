/* global uiframework, numeral, NaN, $SECTIONIMAGE, pdfmanager, $ACTIVEOBJECT, $SECTIONIMAGE, $APPCODE, $CANVAS, $SETTING, $SETTINGS, uicanvas2dgraphics, $MODEL, sharingmanager, $TITLE */
var UNITTYPEUNITLESS = {
    UNITLESS: {name: "", value: 1}
};

var UNITTYPELENGTH = {
    KM: {name: "km", value: 0.000001},
    M: {name: "m", value: 0.001},
    MM: {name: "mm", value: 1.000}, /*base*/
    MI: {name: "mi", value: 0.00000062137},
    YD: {name: "yd", value: 0.00109361},
    FEET: {name: "ft", value: 0.00328083975},
    INCH: {name: "in", value: 0.0393701},
    CM: {name: "cm", value: 0.1},
    DM: {name: "dm", value: 0.01},
    LY: {name: "ly", value: 0.00000000000000000011},
    NM: {name: "nm", value: 1000000}
};

var UNITTYPEUNITAREA = {
    MM2MM: {name: "mm²/mm", value: 1.000}, /*base*/
    IN2IN: {name: "in²/in", value: 0.0393701}
};

var UNITTYPEAREA = {
    SQKM: {name: "km²", value: 0.000000000001},
    SQM: {name: "m²", value: 0.000001},
    SQCM: {name: "cm²", value: 0.01},
    SQMM: {name: "mm²", value: 1.000}, /*base*/
    SQMI: {name: "mi²", value: 0.0000000000003861},
    AC: {name: "ac", value: 0.00000000024711},
    SQYD: {name: "yd²", value: 0.0000011959828321},
    SQFT: {name: "ft²", value: 0.0000107639111056},
    SQIN: {name: "in²", value: 0.00155000477401},
    HA: {name: "ha", value: 0.0000000001}
};

var UNITTYPEVOLUME = {
    CUBM: {name: "m³", value: 0.000000001},
    CUBDM: {name: "dm³ (L)", value: 0.000001},
    CUBCM: {name: "cm³ (mL)", value: 0.001},
    CUBMM: {name: "mm³", value: 1.000}, /*base*/
    CUBYD: {name: "yd³", value: 0.000000001307938785012881},
    CUBFT: {name: "ft³", value: 0.000000035314670111696704},
    CUBIN: {name: "in³", value: 0.000061023842953251101},
    UKGALL: {name: "UK gall", value: 0.000000219969},
    USGALL: {name: "US gall", value: 0.0000002641721},
    OZ: {name: "oz", value: 0.00003381402},
    UKOZ: {name: "UK oz", value: 0.00003519508},
    PINT: {name: "pint", value: 0.00000211338}, //US
    QUART: {name: "quart", value: 0.00000105669} //US
};

var UNITTYPEINERTIA = {
    M: {name: "m⁴", value: 0.000000000001},
    DM: {name: "dm⁴", value: 0.00000001},
    CM: {name: "cm⁴", value: 0.0001},
    MM: {name: "mm⁴", value: 1.000}, /*base*/
    YD: {name: "yd⁴", value: 0.00000000000143037493467793679041},
    FT: {name: "ft⁴", value: 0.00000000011586178228925901435136},
    IN: {name: "in⁴", value: 0.0000024025147994537911714801}
};

var UNITTYPEFORWT = {
    MN: {name: "MN", value: 0.001},
    KN: {name: "kN", value: 1.000}, /*base*/
    N: {name: "N", value: 1000},
    KIP: {name: "kip", value: 0.224808943871},
    KGF: {name: "kgf", value: 101.972},
    TF: {name: "tonf", value: 0.1019716212978},
    LBF: {name: "lbf", value: 224.8089431},
    DYNE: {name: "Dyne", value: 100000000},
    GRAMF: {name: "gram F", value: 101971.6212978},
    JCM: {name: "J/cm", value: 100000},
    JM: {name: "J/m", value: 1000},
    MILN: {name: "mN", value: 1000000},
    OZF: {name: "oz F", value: 3596.9430896}
};

// var UNITTYPEFORLEN = {
//     NMM: {name: "N/mm", value: 1.000},
//     KGCM: {name: "kgf/cm", value: 10197.1621298}, //101.327388793},
//     NCM: {name: "N/cm", value: 10},
//     KGM: {name: "kgf/m", value: 0.0001019716},
//     KGMM: {name: "kgf/mm", value: 0.101971621},
//     KNM: {name: "kN/m", value: 1.000}, /*base*/
//     MTM: {name: "MTon/m", value: 10.355659135},
//     LBIN: {name: "lbf/in", value: 33.964940723},
//     TONFM: {name: "tonf/m", value: 0.1019716212978},
//     KIN: {name: "kip/in", value: 760.016212382},
//     USTIN: {name: "US Ton/in", value: 407.7033357108635},
//     LBFT: {name: "lbf/ft", value: 14.696524471},
//     KFT: {name: "kip/ft", value: 0.014696524471}
// };


var UNITTYPEFORLEN = {
    LBIN: {name: 'lbf/in', value: 5.7101470980001},
    LBFT: {name: 'lbf/ft', value: 68.521779647661},
    KIPIN: {name: 'kip/in', value: 0.00571014717432243},
    KIPFT: {name: 'kip/ft', value: 0.0685217660918692},
    NMM: {name: 'N/mm', value: 1},
    NCM: {name: 'N/cm', value: 10},
    NM: {name: 'N/m', value: 1000},
    KNMM: {name: 'kN/mm', value: 0.001},
    KNCM: {name: 'kN/cm', value: 0.01},
    KNM: {name: 'kN/m', value: 1}, //BASE
    OZFIN: {name: 'ozf/in', value: 91.362354475841},
    OZFFT: {name: 'ozf/ft', value: 1096.34825371009},
    GFMM: {name: 'gf/mm', value: 101.971621297793},
    GFCM: {name: 'gf/cm', value: 1019.71621297793},
    GFM: {name: 'gf/m', value: 101971.621297793},
    KGFMM: {name: 'kgf/mm', value: 0.101971621297793},
    KGFCM: {name: 'kgf/cm', value: 1.01971621297793},
    KGFM: {name: 'kgf/m', value: 101.971621297793},
    TFMM: {name: 'tf/mm', value: 0.000101971621297793},
    TFCM: {name: 'tf/cm', value: 0.00101971621297793},
    TFM: {name: 'tf/m', value: 0.101971621297793}
};

var UNITTYPESTRESSPR = {
    MPA: {name: "MPa", value: 1.000}, /*base*/
    KPA: {name: "kPa", value: 1000},
    KNM: {name: "kN/m²", value: 1000},
    KGSQCM: {name: "kgf/cm²", value: 10.1972},
    KGSQMM: {name: "kgf/mm²", value: 0.1019716212978},
    BAR: {name: "bar", value: 10},
    ATM: {name: "atm", value: 9.86923},
    MH2O: {name: "mH2O", value: 101.9744288922},
    FTH2O: {name: "ft H2O", value: 334.5622921532},
    MMHG: {name: "mm Hg", value: 7500.6150504341},
    USTSQFT: {name: "US Ton/ft²", value: 10.44},
    LBSQIN: {name: "lbf/in²", value: 145.037738},
    LBSQFT: {name: "lbf/ft²", value: 20885.4342},
    KIPSQFT: {name: "kip/ft²", value: 20.8854342},
    PSI: {name: "psi", value: 145.03773773},
    KSI: {name: "ksi", value: 0.14503773773},
    CMHG: {name: "cmHg", value: 750.0615050434},
    INHG: {name: "inHg", value: 295.2998016471},
    KGSQM: {name: "kgf/m²", value: 101971.62129779},
    PA: {name: "pascal", value: 1000000}
};

var UNITTYPEMASS = {
    MT: {name: "mTon", value: 0.001},
    KG: {name: "kg", value: 1.000}, /*base*/
    G: {name: "g", value: 1000},
    UKT: {name: "UK ton", value: 2.204623},
    UST: {name: "US ton", value: 0.00110231},
    CWT: {name: "cwt", value: 0.01968413055222121}
};

var UNITTYPEDENSITY = {
    GCUCM: {name: "g/cm³", value: 0.001},
    KGCUM: {name: "kg/m³", value: 1.000}, /*base*/
    LBCUIN: {name: "lb/in³", value: 0.0000361273},
    UKTCUYD: {name: "UK Ton/yd³", value: 0.00075248},
    USTCUYD: {name: "US Ton/yd³", value: 0.000842777},
    LBCUFT: {name: "lb/ft³", value: 0.062427973725314},
    LBSQSFT: {name: "lbf-s²/ft⁴", value: 0.002}
};

var UNITTYPEUNITMASS = {//TODO
    GCM: {name: "g/cm", value: 0.001},
    KGM: {name: "kg/m", value: 1.000}, /*base*/
    LBIN: {name: "lb/in", value: 0.0000361273},
    UKTYD: {name: "UK Ton/yd", value: 0.00075248},
    USTYD: {name: "US Ton/yd", value: 0.000842777},
    LBFT: {name: "lb/ft", value: 0.062427973725314},
    LBSQSFT: {name: "lbf-s²/ft²", value: 0.002}
};

var UNITTYPEWVOLUME = {
    KNCUM: {name: "kN/m³", value: 1.00}, //base
    LBCUFT: {name: "lbf/ft³", value: 6.37},
    KGFCUM: {name: "kgf/m³", value: 101.972}
};

var UNITTYPEMOMENT = {
    NMM: {name: "N-mm", value: 1000000},
    KGFCM: {name: "kgf-cm", value: 10197.1621298},
    NCM: {name: "N-cm", value: 100000},
    KGFM: {name: "kgf-m", value: 101.9716212978},
    KGFMM: {name: "kgf-mm", value: 101971.6212978},
    KNM: {name: "kN-m", value: 1.000}, /*base*/
    MTONM: {name: "MTon-m", value: 0.112404471935},
    LBIN: {name: "lbf-in", value: 8850.745454036},
    TONFM: {name: "Tonf-m", value: 0.1019716212978},
    KIN: {name: "kip-in", value: 8.850745454036},
    USTIN: {name: "US Ton-in", value: 4.4253753005281435},
    LBFT: {name: "lbf-ft", value: 737.5621211697},
    KFT: {name: "kip-ft", value: 0.7375621211697},
    USTFT: {name: "US Ton-ft", value: 0.36878127504401195833333333333333}
};

var UNITTYPEVELOCITY = {
    MMS: {name: "mm/s", value: 1.000}, /*base*/
    MS: {name: "m/s", value: 0.001000000},
    KMS: {name: "km/s", value: 0.000001000},
    INS: {name: "in/s", value: 0.039370000},
    FTS: {name: "ft/s", value: 0.003280000},
    MILES: {name: "mile/s", value: 0.000000620},
    MMIN: {name: "m/min", value: 0.060000000},
    KMMIN: {name: "km/min", value: 0.000060000},
    FTMIN: {name: "ft/min", value: 0.196850000},
    MIMIN: {name: "mile/min", value: 0.0000372823},
    KMHR: {name: "km/hr", value: 0.003600000},
    MIHR: {name: "mile/hr", value: 0.002236940}
};

var UNITTYPEACCELERATION = {
    MMSQS: {name: "mm/s²", value: 1.000}, /*base*/
    MSQS: {name: "m/s²", value: 0.001},
    KMSQS: {name: "km/s²", value: 0.0000010},
    INSQS: {name: "in/s²", value: 0.039370078740157},
    FTSQS: {name: "ft/s²", value: 0.0032808398950131},
    MISQS: {name: "mile/s²", value: 0.00000062137119223733},
    MSQMIN: {name: "m/min²", value: 3.6},
    KMSQMIN: {name: "km/min²", value: 0.0036},
    FTSQMIN: {name: "ft/min²", value: 11.811023622047},
    MISQMIN: {name: "mile/min²", value: 0.0022369362920544},
    KMSQHR: {name: "km/hr²", value: 12.96},
    MISQHR: {name: "mile/hr²", value: 8.0529706513958}
};

var UNITTYPETIME = {
    SEC: {name: "sec", value: 60},
    MIN: {name: "min", value: 1.000}, /*base*/
    HOUR: {name: "hour", value: 0.01666667},
    DAY: {name: "day", value: 0.0006944446},
    WK: {name: "week", value: 0.000099206371},
    YR: {name: "year", value: 0.000001902588}
};

var UNITTYPEPERMEABILITY = {
    MS: {name: "m/s", value: 1.000}, /*base*/
    CMS: {name: "cm/s", value: 100},
    MYR: {name: "m/year", value: 31540000},
    DARCY: {name: "darcy", value: 0.00666666666}, /*not sure*/
    FTYR: {name: "ft/yr", value: 102500000},
    FTD: {name: "ft/day", value: 283465}
};

var UNITTYPEAANGLE = {
    DEGREE: {name: "deg", symbol: "°", value: 1},
    RADIAN: {name: "rad", symbol: "rad", value: Math.PI / 180}
};

var UNITTYPETEMP = {
    F: {name: "℉", value: 33.8},
    C: {name: "℃", value: 1} //base
};

var UNITTYPETHERMAL = {
    C1: {name: "1/℃", value: 1}, //base
    F1: {name: "1/℉", value: 0.555556}
};

var UNITTYPESTRAIN = {
    MMMM: {name: "mm/mm", value: 1}, //base
    ININ: {name: "in/in", value: 1}
};

var UNIT = {
    US: {name: "US (lb-in)", value: 0},
    SI: {name: "SI (N-mm)", value: 1},
    METRIC: {name: "Metric (kgf-cm)", value: 2}
};

var UNITTYPE = {
    UNITLESS: {name: "Factor", value: 0, unit: UNITTYPEUNITLESS, icon: "length.png"},
    LENGTH: {name: "Length", value: 1, unit: UNITTYPELENGTH, icon: "length.png"},
    AREA: {name: "Area", value: 2, unit: UNITTYPEAREA, icon: "area.png"},
    VOLUME: {name: "Volume", value: 3, unit: UNITTYPEVOLUME, icon: "volume.png"},
    FORWT: {name: "Weight", value: 4, unit: UNITTYPEFORWT, icon: "forceweight.png"},
    FORLEN: {name: "Force/Length", value: 5, unit: UNITTYPEFORLEN, icon: "forcelength.png"},
    STRESSPR: {name: "Pressure", value: 6, unit: UNITTYPESTRESSPR, icon: "stresspressure.png"},
    MASS: {name: "Mass", value: 7, unit: UNITTYPEMASS, icon: "mass.png"},
    DENSITY: {name: "Density", value: 8, unit: UNITTYPEDENSITY, icon: "density.png"},
    MOMENT: {name: "Moment", value: 9, unit: UNITTYPEMOMENT, icon: "moment.png"},
    VELOCITY: {name: "Velocity", value: 10, unit: UNITTYPEVELOCITY, icon: "velocity.png"},
    ACCELERATION: {name: "Acceleration", value: 11, unit: UNITTYPEACCELERATION, icon: "acceleration.png"},
    TIME: {name: "Time", value: 12, unit: UNITTYPETIME, icon: "time.png"},
    PERMEABILITY: {name: "Permeability", value: 13, unit: UNITTYPEPERMEABILITY, icon: "permeability.png"}
};

var DIGITS = {
    ZERO: {name: "0 - 0", value: "", id: 0},
    ONE: {name: "1 - 0.0", value: "0", id: 1},
    TWO: {name: "2 - 0.00", value: "00", id: 2},
    THREE: {name: "3 - 0.000", value: "000", id: 3},
    FOUR: {name: "4 - 0.0000", value: "0000", id: 4},
    FIVE: {name: "5 - 0.00000", value: "00000", id: 5},
    SIX: {name: "6 - 0.000000", value: "000000", id: 6},
    SEVEN: {name: "7 - 0.0000000", value: "0000000", id: 7},
    EIGHT: {name: "8 - 0.00000000", value: "00000000", id: 8},
    NINE: {name: "9 - 0.000000000", value: "000000000", id: 9}
};

var DIGITSYMBOL = {
    NONE: {name: "NONE", value: 0},
    COMMA: {name: "12,345.00", value: 1},
    SPACE: {name: "12 345,00", value: 2}
};

var POSITION = {
    RELATIVE: {val: 1},
    ABSOLUTE: {val: 2},
    FIXED: {val: 3}
};

var VIEWTYPE = {
    XY: {value: 1},
    XZ: {value: 2},
    YZ: {value: 3}
};

var DISPLAYUNIT = {
    LEFT: {name: "Below caption", value: 1},
    RIGHT: {name: "Below value", value: 2}
};

var DIMENSIONLABELLOCATION = {
    OUTSIDE: {name: "Outside", value: 1},
    INSIDE: {name: "Inside", value: 2}
};

var TOLERANCE = {
    TOL0: {name: "0%", value: 0},
    TOL1: {name: "1%", value: 1},
    TOL2: {name: "2%", value: 2},
    TOL3: {name: "3%", value: 3},
    TOL4: {name: "4%", value: 4},
    TOL5: {name: "5%", value: 5},
    TOL6: {name: "6%", value: 6},
    TOL7: {name: "7%", value: 7},
    TOL8: {name: "8%", value: 8},
    TOL9: {name: "9%", value: 9},
    TOL10: {name: "10%", value: 10},
    TOL11: {name: "11%", value: 11},
    TOL12: {name: "12%", value: 12},
    TOL13: {name: "13%", value: 13},
    TOL14: {name: "14%", value: 14},
    TOL15: {name: "15%", value: 15},
    TOL16: {name: "16%", value: 16},
    TOL17: {name: "17%", value: 17},
    TOL18: {name: "18%", value: 18},
    TOL19: {name: "19%", value: 19},
    TOL20: {name: "20%", value: 20},
    TOL21: {name: "21%", value: 21},
    TOL22: {name: "22%", value: 22},
    TOL23: {name: "23%", value: 23},
    TOL24: {name: "24%", value: 24},
    TOL25: {name: "25%", value: 25}
};

var CODE = {
    ACI318_14: {name: "ACI 318-14", value: 0},
    ACI318_11: {name: "ACI 318-11", value: 1},
    BS8110_97: {name: "BS 8110-1:1997", value: 2}
//    EC2_2004: {name: "Eurocode 2", value: 3}
};

var STEELCODE = {
    AISCLRFD: {name: "AISC (LRFD)", value: 0},
    AISCASD: {name: "AISC (ASD)", value: 1}
};

var STRSCURVE = {
    ACI_Whitney: {name: "ACI Whitney Regular", value: 0},
    Euro2_Rect: {name: "Eurocode 2 Rectangular", value: 1},
    BS8110_Rect: {name: "BS 8110 Rectangular", value: 2},
    CSA_Rect: {name: "CSA Rectangular", value: 3},
    AASHTO_Rect: {name: "AASHTO Rectangular", value: 4},
    NZ_Rect: {name: "NZ Rectangular", value: 5},
    UBC_Rect: {name: "UBC Rectangular", value: 6},
    IS_Rect: {name: "IS Rectangular", value: 7},
    Simple_Para: {name: "Simple Parabola", value: 8},
    PCA_Para: {name: "PCA Parabola", value: 9},
    BS8110_Para: {name: "BS 8110 Parabola", value: 10},
    BS8110_Para2: {name: "BS 8110 Parabola", value: 11},
    Mander_CircConfined: {name: "Mander Circular Confined", value: 12},
    Mander_RectConfined: {name: "Mander Rectangular Confined", value: 13},
    Mander_Unconfined: {name: "Mander Unconfined", value: 14},
    Mander_PipeFilled: {name: "Mander Pipe Filled", value: 15},
    USyd_PipeFilled: {name: "Univ. of Sydney Pipe Filled", value: 16},
    Serv_Tri: {name: "Service Triangular", value: 17}
};

var ASTM = {//value in mm for Diameter
    No2: {name: "#2", value: 6.35},
    No3: {name: "#3", value: 9.525},
    No4: {name: "#4", value: 12.7},
    No5: {name: "#5", value: 15.875},
    No6: {name: "#6", value: 19.05},
    No7: {name: "#7", value: 22.225},
    No8: {name: "#8", value: 25.4},
    No9: {name: "#9", value: 28.6512},
    No10: {name: "#10", value: 32.258},
    No11: {name: "#11", value: 35.814},
    No14: {name: "#14", value: 43.0022},
    No18: {name: "#18", value: 57.3278}
};

var METRIC = {//value in mm for Diameter
    d6: {name: "d6", value: 6},
    d8: {name: "d8", value: 8},
    d10: {name: "d10", value: 10},
    d12: {name: "d12", value: 12},
    d14: {name: "d14", value: 14},
    d16: {name: "d16", value: 16},
    d18: {name: "d18", value: 18},
    d20: {name: "d20", value: 20},
    d22: {name: "d22", value: 22},
    d25: {name: "d25", value: 25},
    d26: {name: "d26", value: 26},
    d28: {name: "d28", value: 28},
    d32: {name: "d32", value: 32},
    d36: {name: "d36", value: 36},
    d40: {name: "d40", value: 40},
    d50: {name: "d50", value: 50}
};

var IMPERIAL = {//value in mm for Diameter
    d1_4: {name: "d1/4", value: 6.35, equation: "d 1/4"},
    d5_16: {name: "d5/16", value: 7.9375, equation: "d 5/16"},
    d3_8: {name: "d3/8", value: 9.525, equation: "d 3/8"},
    d7_16: {name: "d7/16", value: 11.1125, equation: "d 7/16"},
    d1_2: {name: "d1/2", value: 12.7, equation: "d 1/2"},
    d5_8: {name: "d5/8", value: 15.875, equation: "d 5/8"},
    d3_4: {name: "d3/4", value: 19.05, equation: "d 3/4"},
    d7_8: {name: "d7/8", value: 22.225, equation: "d 7/8"},
    d1: {name: "d1", value: 25.4, equation: "d1"},
    d11_8: {name: "d1-1/8", value: 28.575, equation: "d1 1/8"},
    d11_4: {name: "d1-1/4", value: 31.75, equation: "d1 1/4"},
    d11_2: {name: "d1-1/2", value: 38.1, equation: "d1 1/2"},
    d2: {name: "d2", value: 50.8, equation: "d2"}
};

var CANADIAN = {//value in mm for Diameter
    M10: {name: "10M", value: 11.3},
    M15: {name: "15M", value: 16},
    M20: {name: "20M", value: 19.5},
    M25: {name: "25M", value: 25.2},
    M30: {name: "30M", value: 29.9},
    M35: {name: "35M", value: 35.7},
    M45: {name: "45M", value: 43.7},
    M55: {name: "55M", value: 56.4},
};

var AUSTRALIAN = {//value in mm for Diameter
    N12: {name: "N12", value: 12},
    N16: {name: "N16", value: 16},
    N20: {name: "N20", value: 20},
    N24: {name: "N24", value: 24},
    N28: {name: "N28", value: 28},
    N32: {name: "N32", value: 32},
    N36: {name: "N36", value: 36}
};

var REBARMODE = {
    Area: {name: "Area", value: 0},
    Bars: {name: "Bars", value: 1},
    Spacing: {name: "Spacing", value: 2}
};

var REBARSET = {
    ASTM: {name: "ASTM", value: 0, rebar: ASTM},
    Metric: {name: "Metric", value: 1, rebar: METRIC},
    Imperial: {name: "Imperial", value: 2, rebar: IMPERIAL},
    Canadian: {name: "Canadian", value: 3, rebar: CANADIAN},
    Australian: {name: "Australian", value: 4, rebar: AUSTRALIAN}
};

var AREASHEAR = {
    GROSS: {name: "Full Gross Area", value: 0},
    WEB: {name: "Web Area Only", value: 1}
};

var DISTRIBUTETORSION = {
    CORNERBARS: {name: "To corner bars", value: 0},
    FOURFACES: {name: "To each face", value: 1}
};

var BEAMDESIGNOPTION = {
    DESIGN: {name: "Design", value: 0, icon: ""},
    INVESTIGATE: {name: "Investigate", value: 1, icon: ""}
};

var FONTSIZE = {
    SMALL: {name: "Small", value: -2},
    MEDIUM: {name: "Medium", value: 0},
    LARGE: {name: "Large", value: 2},
    XLARGE: {name: "X-Large", value: 4},
    XXLARGE: {name: "XX-Large", value: 6}
};

var THEME = {
    LIGHT: {name: "Light", value: 0},
    DARK: {name: "Dark", value: 1}
};

var TRANSPARENCY = {
    T0: {name: "0%", value: 1},
    T10: {name: "10%", value: .9},
    T20: {name: "20%", value: .8},
    T30: {name: "30%", value: .7},
    T40: {name: "40%", value: .6},
    T50: {name: "50%", value: .5},
    T60: {name: "60%", value: .4},
    T70: {name: "70%", value: .3},
    T80: {name: "80%", value: .2},
    T90: {name: "90%", value: .1},
    T100: {name: "100%", value: 0}
};

var MIXEDBARS = {
    MIX1: {name: "1", value: 1},
    MIX2: {name: "2", value: 2},
    MIX3: {name: "3", value: 3},
    MIX4: {name: "4", value: 4},
    MIX5: {name: "5", value: 5}
};

var $SECTIONIMAGE;
var $CANVAS;
var $REPORTTITLE;
var $APPCODE;
var $ENABLETHEME = false;

var $MAXDIGIT = 1E10;

var COLORSCALE = [
    [200, 0, 200], //Purple
    [255, 0, 0], //Red
    [255, 128, 0], //Orange
    [255, 255, 0], //Yellow    
    [0, 255, 0], //Green
    [0, 255, 255], //Cyan
    [0, 0, 255]    //Blue
];

var COLORS = {
    BLACK: {value: 0x000000, name: '#000000'},
    WHITE: {value: 0xFFFFFF, name: '#FFFFFF'},
    GREY: {value: 0x9E9E9E, name: '#9E9E9E'},
    GREY1: {value: 0xFAFAFA, name: '#FAFAFA'},
    GREY2: {value: 0xF5F5F5, name: '#F5F5F5'},
    GREY3: {value: 0xEEEEEE, name: '#EEEEEE'},
    GREY4: {value: 0xE0E0E0, name: '#E0E0E0'},
    GREY5: {value: 0xBDBDBD, name: '#BDBDBD'},
    GREY6: {value: 0x9E9E9E, name: '#9E9E9E'},
    GREY7: {value: 0x757575, name: '#757575'},
    GREY8: {value: 0x616161, name: '#616161'},
    GREY9: {value: 0x424242, name: '#424242'},
    GREY10: {value: 0x212121, name: '#212121'},
    BLUEGREY: {value: 0x607D8B, name: '#607D8B'},
    BLUEGREY1: {value: 0xECEFF1, name: '#ECEFF1'},
    BLUEGREY2: {value: 0xCFD8DC, name: '#CFD8DC'},
    BLUEGREY3: {value: 0xB0BEC5, name: '#B0BEC5'},
    BLUEGREY4: {value: 0x90A4AE, name: '#90A4AE'},
    BLUEGREY5: {value: 0x78909C, name: '#78909C'},
    BLUEGREY6: {value: 0x607D8B, name: '#607D8B'},
    BLUEGREY7: {value: 0x546E7A, name: '#546E7A'},
    BLUEGREY8: {value: 0x455A64, name: '#455A64'},
    BLUEGREY9: {value: 0x37474F, name: '#37474F'},
    BLUEGREY10: {value: 0x263238, name: '#263238'},
    RED: {value: 0xF44336, name: '#F44336'},
    RED1: {value: 0xFFEBEE, name: '#FFEBEE'},
    RED2: {value: 0xFFCDD2, name: '#FFCDD2'},
    RED3: {value: 0xEF9A9A, name: '#EF9A9A'},
    RED4: {value: 0xE57373, name: '#E57373'},
    RED5: {value: 0xEF5350, name: '#EF5350'},
    RED6: {value: 0xF44336, name: '#F44336'},
    RED7: {value: 0xE53935, name: '#E53935'},
    RED8: {value: 0xD32F2F, name: '#D32F2F'},
    RED9: {value: 0xC62828, name: '#C62828'},
    RED10: {value: 0xB71C1C, name: '#B71C1C'},
    PINK: {value: 0xE91E63, name: '#E91E63'},
    PINK1: {value: 0xFCE4EC, name: '#FCE4EC'},
    PINK2: {value: 0xF8BBD0, name: '#F8BBD0'},
    PINK3: {value: 0xF48FB1, name: '#F48FB1'},
    PINK4: {value: 0xF06292, name: '#F06292'},
    PINK5: {value: 0xEC407A, name: '#EC407A'},
    PINK6: {value: 0xE91E63, name: '#E91E63'},
    PINK7: {value: 0xD81B60, name: '#D81B60'},
    PINK8: {value: 0xC2185B, name: '#C2185B'},
    PINK9: {value: 0xAD1457, name: '#AD1457'},
    PINK10: {value: 0x880E4F, name: '#880E4F'},
    PURPLE: {value: 0x9C27B0, name: '#9C27B0'},
    PURPLE1: {value: 0xF3E5F5, name: '#F3E5F5'},
    PURPLE2: {value: 0xE1BEE7, name: '#E1BEE7'},
    PURPLE3: {value: 0xCE93D8, name: '#CE93D8'},
    PURPLE4: {value: 0xBA68C8, name: '#BA68C8'},
    PURPLE5: {value: 0xAB47BC, name: '#AB47BC'},
    PURPLE6: {value: 0x9C27B0, name: '#9C27B0'},
    PURPLE7: {value: 0x8E24AA, name: '#8E24AA'},
    PURPLE8: {value: 0x7B1FA2, name: '#7B1FA2'},
    PURPLE9: {value: 0x6A1B9A, name: '#6A1B9A'},
    PURPLE10: {value: 0x4A148C, name: '#4A148C'},
    DEEPPURPLE: {value: 0x673AB7, name: '#673AB7'},
    DEEPPURPLE1: {value: 0xEDE7F6, name: '#EDE7F6'},
    DEEPPURPLE2: {value: 0xD1C4E9, name: '#D1C4E9'},
    DEEPPURPLE3: {value: 0xB39DDB, name: '#B39DDB'},
    DEEPPURPLE4: {value: 0x9575CD, name: '#9575CD'},
    DEEPPURPLE5: {value: 0x7E57C2, name: '#7E57C2'},
    DEEPPURPLE6: {value: 0x673AB7, name: '#673AB7'},
    DEEPPURPLE7: {value: 0x5E35B1, name: '#5E35B1'},
    DEEPPURPLE8: {value: 0x512DA8, name: '#512DA8'},
    DEEPPURPLE9: {value: 0x4527A0, name: '#4527A0'},
    DEEPPURPLE10: {value: 0x311B92, name: '#311B92'},
    INDIGO: {value: 0x3F51B5, name: '#3F51B5'},
    INDIGO1: {value: 0xE8EAF6, name: '#E8EAF6'},
    INDIGO2: {value: 0xC5CAE9, name: '#C5CAE9'},
    INDIGO3: {value: 0x9FA8DA, name: '#9FA8DA'},
    INDIGO4: {value: 0x7986CB, name: '#7986CB'},
    INDIGO5: {value: 0x5C6BC0, name: '#5C6BC0'},
    INDIGO6: {value: 0x3F51B5, name: '#3F51B5'},
    INDIGO7: {value: 0x3949AB, name: '#3949AB'},
    INDIGO8: {value: 0x303F9F, name: '#303F9F'},
    INDIGO9: {value: 0x283593, name: '#283593'},
    INDIGO10: {value: 0x1A237E, name: '#1A237E'},
    BLUE: {value: 0x2196F3, name: '#2196F3'},
    BLUE1: {value: 0xE3F2FD, name: '#E3F2FD'},
    BLUE2: {value: 0xBBDEFB, name: '#BBDEFB'},
    BLUE3: {value: 0x90CAF9, name: '#90CAF9'},
    BLUE4: {value: 0x64B5F6, name: '#64B5F6'},
    BLUE5: {value: 0x42A5F5, name: '#42A5F5'},
    BLUE6: {value: 0x2196F3, name: '#2196F3'},
    BLUE7: {value: 0x1E88E5, name: '#1E88E5'},
    BLUE8: {value: 0x1976D2, name: '#1976D2'},
    BLUE9: {value: 0x1565C0, name: '#1565C0'},
    BLUE10: {value: 0x0D47A1, name: '#0D47A1'},
    LIGHTBLUE: {value: 0x03A9F4, name: '#03A9F4'},
    LIGHTBLUE1: {value: 0xE1F5FE, name: '#E1F5FE'},
    LIGHTBLUE2: {value: 0xB3E5FC, name: '#B3E5FC'},
    LIGHTBLUE3: {value: 0x81D4FA, name: '#81D4FA'},
    LIGHTBLUE4: {value: 0x4FC3F7, name: '#4FC3F7'},
    LIGHTBLUE5: {value: 0x29B6F6, name: '#29B6F6'},
    LIGHTBLUE6: {value: 0x03A9F4, name: '#03A9F4'},
    LIGHTBLUE7: {value: 0x039BE5, name: '#039BE5'},
    LIGHTBLUE8: {value: 0x0288D1, name: '#0288D1'},
    LIGHTBLUE9: {value: 0x0277BD, name: '#0277BD'},
    LIGHTBLUE10: {value: 0x01579B, name: '#01579B'},
    CYAN: {value: 0x00BCD4, name: '#00BCD4'},
    CYAN1: {value: 0xE0F7FA, name: '#E0F7FA'},
    CYAN2: {value: 0xB2EBF2, name: '#B2EBF2'},
    CYAN3: {value: 0x80DEEA, name: '#80DEEA'},
    CYAN4: {value: 0x4DD0E1, name: '#4DD0E1'},
    CYAN5: {value: 0x26C6DA, name: '#26C6DA'},
    CYAN6: {value: 0x00BCD4, name: '#00BCD4'},
    CYAN7: {value: 0x00ACC1, name: '#00ACC1'},
    CYAN8: {value: 0x0097A7, name: '#0097A7'},
    CYAN9: {value: 0x00838F, name: '#00838F'},
    CYAN10: {value: 0x006064, name: '#006064'},
    TEAL: {value: 0x009688, name: '#009688'},
    TEAL1: {value: 0xE0F2F1, name: '#E0F2F1'},
    TEAL2: {value: 0xB2DFDB, name: '#B2DFDB'},
    TEAL3: {value: 0x80CBC4, name: '#80CBC4'},
    TEAL4: {value: 0x4DB6AC, name: '#4DB6AC'},
    TEAL5: {value: 0x26A69A, name: '#26A69A'},
    TEAL6: {value: 0x009688, name: '#009688'},
    TEAL7: {value: 0x00897B, name: '#00897B'},
    TEAL8: {value: 0x00796B, name: '#00796B'},
    TEAL9: {value: 0x00695C, name: '#00695C'},
    TEAL10: {value: 0x004D40, name: '#004D40'},
    GREEN: {value: 0x4CAF50, name: '#4CAF50'},
    GREEN1: {value: 0xE8F5E9, name: '#E8F5E9'},
    GREEN2: {value: 0xC8E6C9, name: '#C8E6C9'},
    GREEN3: {value: 0xA5D6A7, name: '#A5D6A7'},
    GREEN4: {value: 0x81C784, name: '#81C784'},
    GREEN5: {value: 0x66BB6A, name: '#66BB6A'},
    GREEN6: {value: 0x4CAF50, name: '#4CAF50'},
    GREEN7: {value: 0x43A047, name: '#43A047'},
    GREEN8: {value: 0x388E3C, name: '#388E3C'},
    GREEN9: {value: 0x2E7D32, name: '#2E7D32'},
    GREEN10: {value: 0x1B5E20, name: '#1B5E20'},
    LIGHTGREEN: {value: 0x8BC34A, name: '#8BC34A'},
    LIGHTGREEN1: {value: 0xF1F8E9, name: '#F1F8E9'},
    LIGHTGREEN2: {value: 0xDCEDC8, name: '#DCEDC8'},
    LIGHTGREEN3: {value: 0xC5E1A5, name: '#C5E1A5'},
    LIGHTGREEN4: {value: 0xAED581, name: '#AED581'},
    LIGHTGREEN5: {value: 0x9CCC65, name: '#9CCC65'},
    LIGHTGREEN6: {value: 0x8BC34A, name: '#8BC34A'},
    LIGHTGREEN7: {value: 0x7CB342, name: '#7CB342'},
    LIGHTGREEN8: {value: 0x689F38, name: '#689F38'},
    LIGHTGREEN9: {value: 0x558B2F, name: '#558B2F'},
    LIGHTGREEN10: {value: 0x33691E, name: '#33691E'},
    LIME: {value: 0xCDDC39, name: '#CDDC39'},
    LIME1: {value: 0xF9FBE7, name: '#F9FBE7'},
    LIME2: {value: 0xF0F4C3, name: '#F0F4C3'},
    LIME3: {value: 0xE6EE9C, name: '#E6EE9C'},
    LIME4: {value: 0xDCE775, name: '#DCE775'},
    LIME5: {value: 0xD4E157, name: '#D4E157'},
    LIME6: {value: 0xCDDC39, name: '#CDDC39'},
    LIME7: {value: 0xC0CA33, name: '#C0CA33'},
    LIME8: {value: 0xAFB42B, name: '#AFB42B'},
    LIME9: {value: 0x9E9D24, name: '#9E9D24'},
    LIME10: {value: 0x827717, name: '#827717'},
    YELLOW: {value: 0xFFEB3B, name: '#FFEB3B'},
    YELLOW1: {value: 0xFFFDE7, name: '#FFFDE7'},
    YELLOW2: {value: 0xFFF9C4, name: '#FFF9C4'},
    YELLOW3: {value: 0xFFF59D, name: '#FFF59D'},
    YELLOW4: {value: 0xFFF176, name: '#FFF176'},
    YELLOW5: {value: 0xFFEE58, name: '#FFEE58'},
    YELLOW6: {value: 0xFFEB3B, name: '#FFEB3B'},
    YELLOW7: {value: 0xFDD835, name: '#FDD835'},
    YELLOW8: {value: 0xFBC02D, name: '#FBC02D'},
    YELLOW9: {value: 0xF9A825, name: '#F9A825'},
    YELLOW10: {value: 0xF57F17, name: '#F57F17'},
    AMBER: {value: 0xFFC107, name: '#FFC107'},
    AMBER1: {value: 0xFFF8E1, name: '#FFF8E1'},
    AMBER2: {value: 0xFFECB3, name: '#FFECB3'},
    AMBER3: {value: 0xFFE082, name: '#FFE082'},
    AMBER4: {value: 0xFFD54F, name: '#FFD54F'},
    AMBER5: {value: 0xFFCA28, name: '#FFCA28'},
    AMBER6: {value: 0xFFC107, name: '#FFC107'},
    AMBER7: {value: 0xFFB300, name: '#FFB300'},
    AMBER8: {value: 0xFFA000, name: '#FFA000'},
    AMBER9: {value: 0xFF8F00, name: '#FF8F00'},
    AMBER10: {value: 0xFF6F00, name: '#FF6F00'},
    ORANGE: {value: 0xFF9800, name: '#FF9800'},
    ORANGE1: {value: 0xFFF3E0, name: '#FFF3E0'},
    ORANGE2: {value: 0xFFE0B2, name: '#FFE0B2'},
    ORANGE3: {value: 0xFFCC80, name: '#FFCC80'},
    ORANGE4: {value: 0xFFB74D, name: '#FFB74D'},
    ORANGE5: {value: 0xFFA726, name: '#FFA726'},
    ORANGE6: {value: 0xFF9800, name: '#FF9800'},
    ORANGE7: {value: 0xFB8C00, name: '#FB8C00'},
    ORANGE8: {value: 0xF57C00, name: '#F57C00'},
    ORANGE9: {value: 0xEF6C00, name: '#EF6C00'},
    ORANGE10: {value: 0xE65100, name: '#E65100'},
    DEEPORANGE: {value: 0xFF5722, name: '#FF5722'},
    DEEPORANGE1: {value: 0xFBE9E7, name: '#FBE9E7'},
    DEEPORANGE2: {value: 0xFFCCBC, name: '#FFCCBC'},
    DEEPORANGE3: {value: 0xFFAB91, name: '#FFAB91'},
    DEEPORANGE4: {value: 0xFF8A65, name: '#FF8A65'},
    DEEPORANGE5: {value: 0xFF7043, name: '#FF7043'},
    DEEPORANGE6: {value: 0xFF5722, name: '#FF5722'},
    DEEPORANGE7: {value: 0xF4511E, name: '#F4511E'},
    DEEPORANGE8: {value: 0xE64A19, name: '#E64A19'},
    DEEPORANGE9: {value: 0xD84315, name: '#D84315'},
    DEEPORANGE10: {value: 0xBF360C, name: '#BF360C'},
    BROWN: {value: 0x795548, name: '#795548'},
    BROWN1: {value: 0xEFEBE9, name: '#EFEBE9'},
    BROWN2: {value: 0xD7CCC8, name: '#D7CCC8'},
    BROWN3: {value: 0xBCAAA4, name: '#BCAAA4'},
    BROWN4: {value: 0xA1887F, name: '#A1887F'},
    BROWN5: {value: 0x8D6E63, name: '#8D6E63'},
    BROWN6: {value: 0x795548, name: '#795548'},
    BROWN7: {value: 0x6D4C41, name: '#6D4C41'},
    BROWN8: {value: 0x5D4037, name: '#5D4037'},
    BROWN9: {value: 0x4E342E, name: '#4E342E'},
    BROWN10: {value: 0x3E2723, name: '#3E2723'}
};

var common = {};
common.mindockformsize = 420;
common.useunitfactor = true;
common.orientationtolerance = 0.001;

common.top = 0;
common.left = 0;
common.right = 0;

function commonunit(unit) {
    this.category = new uiframework.PropertyCategory("Units");
    this.length = new uiframework.PropertyEnum("Length", UNITTYPELENGTH.M, UNITTYPELENGTH);
    this.thickness = new uiframework.PropertyEnum("Thickness", UNITTYPELENGTH.MM, UNITTYPELENGTH);
    this.area = new uiframework.PropertyEnum("Area", UNITTYPEAREA.SQMM, UNITTYPEAREA);
    this.force = new uiframework.PropertyEnum("Force", UNITTYPEFORWT.KN, UNITTYPEFORWT);
    this.moment = new uiframework.PropertyEnum("Moment", UNITTYPEMOMENT.KNM, UNITTYPEMOMENT);
    this.uniformload = new uiframework.PropertyEnum("Force/Length", UNITTYPEFORLEN.KNM, UNITTYPEFORLEN);
    this.inertia = new uiframework.PropertyEnum("Inertia", UNITTYPEINERTIA.M, UNITTYPEINERTIA);
    this.sectionmodulus = new uiframework.PropertyEnum("Section Modulus", UNITTYPEVOLUME.CUBM, UNITTYPEVOLUME);
    this.stress = new uiframework.PropertyEnum("Stress", UNITTYPESTRESSPR.MPA, UNITTYPESTRESSPR);
    this.angle = new uiframework.PropertyEnum("Angle", UNITTYPEAANGLE.DEGREE, UNITTYPEAANGLE);
    this.temperature = new uiframework.PropertyEnum("Temperature", UNITTYPETEMP.C, UNITTYPETEMP);
    this.weight = new uiframework.PropertyEnum("Unit Weight", UNITTYPEFORWT.KN, UNITTYPEFORWT);
    this.thermal = new uiframework.PropertyEnum("Thermal Coefficient", UNITTYPETHERMAL.C1, UNITTYPETHERMAL);
    this.density = new uiframework.PropertyEnum("Mass/Volume", UNITTYPEDENSITY.KGCUM, UNITTYPEDENSITY);
    this.weightvol = new uiframework.PropertyEnum("Weight/Volume", UNITTYPEWVOLUME.KNCUM, UNITTYPEWVOLUME);
    this.strain = new uiframework.PropertyEnum("Strain", UNITTYPESTRAIN.MMMM, UNITTYPESTRAIN);
    this.unitmass = new uiframework.PropertyEnum("Mass/Length", UNITTYPEUNITMASS.KGM, UNITTYPEUNITMASS);
    this.unitarea = new uiframework.PropertyEnum("Area/Length", UNITTYPEUNITAREA.MM2MM, UNITTYPEUNITAREA);
    this.unitless = new uiframework.PropertyEnum("Factor", UNITTYPEUNITLESS.UNITLESS, UNITTYPEUNITLESS);

    this.Initialize = function (unit) {
        switch (unit.value) {
            case UNIT.SI.value:
                this.length.Update(new uiframework.PropertyEnum("Length", UNITTYPELENGTH.MM, UNITTYPELENGTH));
                this.thickness.Update(new uiframework.PropertyEnum("Thickness", UNITTYPELENGTH.MM, UNITTYPELENGTH));
                this.area.Update(new uiframework.PropertyEnum("Area", UNITTYPEAREA.SQMM, UNITTYPEAREA));
                this.force.Update(new uiframework.PropertyEnum("Force", UNITTYPEFORWT.KN, UNITTYPEFORWT));
                this.moment.Update(new uiframework.PropertyEnum("Moment", UNITTYPEMOMENT.KNM, UNITTYPEMOMENT));
                this.uniformload.Update(new uiframework.PropertyEnum("Force/Length", UNITTYPEFORLEN.KNM, UNITTYPEFORLEN));
                this.inertia.Update(new uiframework.PropertyEnum("Inertia", UNITTYPEINERTIA.MM, UNITTYPEINERTIA));
                this.sectionmodulus.Update(new uiframework.PropertyEnum("Section Modulus", UNITTYPEVOLUME.CUBMM, UNITTYPEVOLUME));
                this.stress.Update(new uiframework.PropertyEnum("Stress", UNITTYPESTRESSPR.MPA, UNITTYPESTRESSPR));
                this.angle.Update(new uiframework.PropertyEnum("Angle", UNITTYPEAANGLE.DEGREE, UNITTYPEAANGLE));
                this.temperature.Update(new uiframework.PropertyEnum("Temperature", UNITTYPETEMP.C, UNITTYPETEMP));
                this.weight.Update(new uiframework.PropertyEnum("Unit Weight", UNITTYPEFORWT.KN, UNITTYPEFORWT));
                this.thermal.Update(new uiframework.PropertyEnum("Thermal Coefficient", UNITTYPETHERMAL.C1, UNITTYPETHERMAL));
                this.density.Update(new uiframework.PropertyEnum("Mass/Volume", UNITTYPEDENSITY.KGCUM, UNITTYPEDENSITY));
                this.weightvol.Update(new uiframework.PropertyEnum("Weight/Volume", UNITTYPEWVOLUME.KNCUM, UNITTYPEWVOLUME));
                this.strain.Update(new uiframework.PropertyEnum("Strain", UNITTYPESTRAIN.MMMM, UNITTYPESTRAIN));
                this.unitmass.Update(new uiframework.PropertyEnum("Mass/Length", UNITTYPEUNITMASS.KGM, UNITTYPEUNITMASS));
                this.unitarea = new uiframework.PropertyEnum("Area/Length", UNITTYPEUNITAREA.MM2MM, UNITTYPEUNITAREA);
                this.unitless.Update(new uiframework.PropertyEnum("Factor", UNITTYPEUNITLESS.UNITLESS, UNITTYPEUNITLESS));
                break;

            case UNIT.US.value:
                this.length.Update(new uiframework.PropertyEnum("Length", UNITTYPELENGTH.INCH, UNITTYPELENGTH));
                this.thickness.Update(new uiframework.PropertyEnum("Thickness", UNITTYPELENGTH.INCH, UNITTYPELENGTH));
                this.area.Update(new uiframework.PropertyEnum("Area", UNITTYPEAREA.SQIN, UNITTYPEAREA));
                this.force.Update(new uiframework.PropertyEnum("Force", UNITTYPEFORWT.KIP, UNITTYPEFORWT));
                this.moment.Update(new uiframework.PropertyEnum("Moment", UNITTYPEMOMENT.KFT, UNITTYPEMOMENT));
                this.uniformload.Update(new uiframework.PropertyEnum("Force/Length", UNITTYPEFORLEN.LBFT, UNITTYPEFORLEN));
                this.inertia.Update(new uiframework.PropertyEnum("Inertia", UNITTYPEINERTIA.IN, UNITTYPEINERTIA));
                this.sectionmodulus.Update(new uiframework.PropertyEnum("Section Modulus", UNITTYPEVOLUME.CUBIN, UNITTYPEVOLUME));
                this.stress.Update(new uiframework.PropertyEnum("Stress", UNITTYPESTRESSPR.LBSQIN, UNITTYPESTRESSPR));
                this.angle.Update(new uiframework.PropertyEnum("Angle", UNITTYPEAANGLE.DEGREE, UNITTYPEAANGLE));
                this.temperature.Update(new uiframework.PropertyEnum("Temperature", UNITTYPETEMP.F, UNITTYPETEMP));
                this.weight.Update(new uiframework.PropertyEnum("Unit Weight", UNITTYPEFORWT.KIP, UNITTYPEFORWT));
                this.thermal.Update(new uiframework.PropertyEnum("Thermal Coefficient", UNITTYPETHERMAL.F1, UNITTYPETHERMAL));
                this.density.Update(new uiframework.PropertyEnum("Mass/Volume", UNITTYPEDENSITY.LBSQSFT, UNITTYPEDENSITY));
                this.weightvol.Update(new uiframework.PropertyEnum("Weight/Volume", UNITTYPEWVOLUME.LBCUFT, UNITTYPEWVOLUME));
                this.strain.Update(new uiframework.PropertyEnum("Strain", UNITTYPESTRAIN.ININ, UNITTYPESTRAIN));
                this.unitmass.Update(new uiframework.PropertyEnum("Mass/Length", UNITTYPEUNITMASS.LBFT, UNITTYPEUNITMASS));
                this.unitarea = new uiframework.PropertyEnum("Area/Length", UNITTYPEUNITAREA.IN2IN, UNITTYPEUNITAREA);
                this.unitless.Update(new uiframework.PropertyEnum("Factor", UNITTYPEUNITLESS.UNITLESS, UNITTYPEUNITLESS));
                break;

            case UNIT.METRIC.value:
                this.length.Update(new uiframework.PropertyEnum("Length", UNITTYPELENGTH.CM, UNITTYPELENGTH));
                this.thickness.Update(new uiframework.PropertyEnum("Length", UNITTYPELENGTH.CM, UNITTYPELENGTH));
                this.area.Update(new uiframework.PropertyEnum("Area", UNITTYPEAREA.SQCM, UNITTYPEAREA));
                this.force.Update(new uiframework.PropertyEnum("Force", UNITTYPEFORWT.KGF, UNITTYPEFORWT));
                this.moment.Update(new uiframework.PropertyEnum("Moment", UNITTYPEMOMENT.KGFM, UNITTYPEMOMENT));
                this.uniformload.Update(new uiframework.PropertyEnum("Force/Length", UNITTYPEFORLEN.TFM, UNITTYPEFORLEN));
                this.inertia.Update(new uiframework.PropertyEnum("Inertia", UNITTYPEINERTIA.CM, UNITTYPEINERTIA));
                this.sectionmodulus.Update(new uiframework.PropertyEnum("Section Modulus", UNITTYPEVOLUME.CUBMM, UNITTYPEVOLUME));
                this.stress.Update(new uiframework.PropertyEnum("Stress", UNITTYPESTRESSPR.KGSQMM, UNITTYPESTRESSPR));
                this.angle.Update(new uiframework.PropertyEnum("Angle", UNITTYPEAANGLE.DEGREE, UNITTYPEAANGLE));
                this.temperature.Update(new uiframework.PropertyEnum("Temperature", UNITTYPETEMP.C, UNITTYPETEMP));
                this.weight.Update(new uiframework.PropertyEnum("Unit Weight", UNITTYPEFORWT.KGF, UNITTYPEFORWT));
                this.thermal.Update(new uiframework.PropertyEnum("Thermal Coefficient", UNITTYPETHERMAL.C1, UNITTYPETHERMAL));
                this.density.Update(new uiframework.PropertyEnum("Mass/Volume", UNITTYPEDENSITY.KGCUM, UNITTYPEDENSITY));
                this.weightvol.Update(new uiframework.PropertyEnum("Weight/Volume", UNITTYPEWVOLUME.KGFCUM, UNITTYPEWVOLUME));
                this.strain.Update(new uiframework.PropertyEnum("Strain", UNITTYPESTRAIN.MMMM, UNITTYPESTRAIN));
                this.unitmass.Update(new uiframework.PropertyEnum("Mass/Length", UNITTYPEUNITMASS.KGM, UNITTYPEUNITMASS));
                this.unitarea = new uiframework.PropertyEnum("Area/Length", UNITTYPEUNITAREA.MM2MM, UNITTYPEUNITAREA);
                this.unitless.Update(new uiframework.PropertyEnum("Factor", UNITTYPEUNITLESS.UNITLESS, UNITTYPEUNITLESS));
                break;
        }
    };

    this.Initialize(unit);
}

common.commonsettings = function () {
    this.unitchanged = false;

    this.Initialize = function (hascanvas) {
        this.settings = new uiframework.PropertyCategory("General");
        this.unit = new uiframework.PropertyEnum("Unit Standard", UNIT.US, UNIT);
        this.unit.height = 182;
        this.formatting = new uiframework.PropertyCategory("Number Format");
        this.nodigits = new uiframework.PropertyEnum("Decimal Places", DIGITS.TWO, DIGITS);
        this.digitsymbol = new uiframework.PropertyEnum("Number Separator", DIGITSYMBOL.COMMA, DIGITSYMBOL);
        this.digitsymbol.height = 182;
        this.showexponent = new uiframework.PropertyBoolean("Show Exponent", false);

        this.others = new uiframework.PropertyCategory("Others");
        this.others.visible = false;

        if ($ENABLETHEME) {
            this.themegroup = new uiframework.PropertyCategory("Theme");
            this.theme = new uiframework.PropertyEnum("Theme", THEME.LIGHT, THEME);
            this.InitializeTheme();
        }

        this.displayunit = new uiframework.PropertyEnum("Unit Location", DISPLAYUNIT.LEFT, DISPLAYUNIT);
        this.displayunit.visible = false;

        if (hascanvas) {
            var sec = new uicanvas2dgraphics.SectionBase();

            //dimensions
            this.dimensions = new uiframework.PropertyCategory("Dimensions");
            this.showdimension = new uiframework.PropertyBoolean("Show Dimensioning", true);

            this.showdimension.onchangeevent = function () {
                if ($SETTINGS) {
                    var visible = $SETTINGS.showdimension.value;
                    $SETTINGS.showsymbol.SetVisible(visible);
                    $SETTINGS.showvalue.SetVisible(visible);
                    $SETTINGS.showunit.SetVisible(visible);
                    $SETTINGS.dimtextcolor.SetVisible(visible);
                    $SETTINGS.dimlinecolor.SetVisible(visible);
                    $SETTINGS.dimensionlabel.SetVisible(visible);
                }
            };

            this.showsymbol = new uiframework.PropertyBoolean("Show Symbols", true);
            this.showvalue = new uiframework.PropertyBoolean("Show Values", true);
            this.showunit = new uiframework.PropertyBoolean("Show Units", true);
            this.dimtextcolor = new uiframework.PropertyColor("Text Color", sec.textcolor);
            this.dimlinecolor = new uiframework.PropertyColor("Dimension Color", sec.linecolor);
            this.dimensionlabel = new uiframework.PropertyEnum("Label Location", DIMENSIONLABELLOCATION.OUTSIDE, DIMENSIONLABELLOCATION);
            this.dimensionlabel.height = 135;

            //section
            this.section = new uiframework.PropertyCategory("Section");
            this.showlocalaxis = new uiframework.PropertyBoolean("Show Local Axes", true);
            this.sectionlinecolor = new uiframework.PropertyColor("Shape Outline", sec.property.linecolor);
            this.sectionfillcolor = new uiframework.PropertyColor("Shape Fill", sec.property.fillcolor);
            this.sectiontransparency = new uiframework.PropertyEnum("Transparency", TRANSPARENCY.T70, TRANSPARENCY);
        }
    };

    this.InitializeTheme = function () {

        if ($ENABLETHEME) {
            if (this.theme.value.value === THEME.LIGHT.value) {
                this.toolbartextcolor = new uiframework.PropertyColor("Toolbar Text Color", "#000", ".toolbar-button .fa|.toolbar .appname|.toolbar-button-settings .fa", "color");
                this.toolbartextcolor.visible = false;
                this.toolbarbackgroundcolor = new uiframework.PropertyColor("Toolbar Background Color", "#FFF", ".toolbar|.grid.canvasgrid .toolbar .fa", "background-color");
                this.toolbarbackgroundcolor.visible = false;


                this.primarytextcolor = new uiframework.PropertyColor("Primary Text Color", "#000", ".grid.content-area .toolbar-button|.grid.content-area .list-thumbnail|.property-category|.drawer-header|body|.fa-times-circle-o|.toolbar-property .toolbar-button span", "color");
                this.primarytextcolor.visible = false;
                this.secondarytextcolor = new uiframework.PropertyColor("Secondary Text Color", "#FFF", "", "color");
                this.secondarytextcolor.visible = false;

                this.appbackgroundcolor1 = new uiframework.PropertyColor("Primary Background Color", "linear-gradient(to bottom,#e6ecf5,#d4dfed)", ".grid.content-area > .grid", "background");
                this.appbackgroundcolor1.visible = false;

                this.formheaderbackgroundcolor = new uiframework.PropertyColor("Primary Background Color", "#fafafa", ".drawer-header|.form-header", "background-color");
                this.formheaderbackgroundcolor.visible = false;

                this.primarybackgroundcolor = new uiframework.PropertyColor("Primary Background Color", "#FFF", ".property|.drawer|.form|.property-combobox .combobox-editor|.grid", "background-color");
                this.primarybackgroundcolor.visible = false;
                this.secondarybackgroundcolor = new uiframework.PropertyColor("Secondary Background Color", "#fafafa", ".grid.content-area .property-container|.property-category", "background-color");
                this.secondarybackgroundcolor.visible = false;

                if ($CANVAS) {
                    $CANVAS.settings.background = "#FFF";
                    $CANVAS.settings.axis = "#AAA";
                    $CANVAS.settings.major = "#DDD";
                    $CANVAS.settings.minor = "#EEE";
                    $CANVAS.settings.ruler = "#F8F8F8";
                    $CANVAS.settings.rulertext = "#000";
                    $CANVAS.settings.fontcolor = "#000";

                    //$CANVAS.drawaxisprop.linecolor = "#F00";
                    $CANVAS.drawaxisprop.fillcolor = "rgba(0,0,255,0.2)";
                }

                if ($MODEL) {
                    if ($MODEL.settings.dimtextcolor) {
                        $MODEL.settings.dimtextcolor.value = "#000";
                        $MODEL.settings.dimlinecolor.value = "#00F";

                        $MODEL.settings.sectionlinecolor.value = "#000";
                        $MODEL.settings.sectionfillcolor.value = "rgba(102, 153, 204, 0)";
                    }
                }

            } else if (this.theme.value.value === THEME.DARK.value) {
                this.toolbartextcolor = new uiframework.PropertyColor("Toolbar Text Color", "#999999", ".toolbar-button .fa|.toolbar .appname|.toolbar-button-settings .fa", "color");
                this.toolbartextcolor.visible = false;
                this.toolbarbackgroundcolor = new uiframework.PropertyColor("Toolbar Background Color", "#2d2d30", ".toolbar|.grid.canvasgrid .toolbar .fa", "background-color");
                this.toolbarbackgroundcolor.visible = false;

                this.primarytextcolor = new uiframework.PropertyColor("Primary Text Color", "#FFF", ".grid.content-area .toolbar-button|.grid.content-area .list-thumbnail|.property-category|.drawer-header|body|.fa-times-circle-o|.toolbar-property .toolbar-button span", "color");
                this.primarytextcolor.visible = false;
                this.secondarytextcolor = new uiframework.PropertyColor("Secondary Text Color", "#AAA", ".property-unit-left|p.bold", "color");
                this.secondarytextcolor.visible = false;

                this.appbackgroundcolor1 = new uiframework.PropertyColor("Primary Background Color", "linear-gradient(to bottom,#252526,#252526)", ".grid.content-area > .grid", "background");
                this.appbackgroundcolor1.visible = false;

                this.formheaderbackgroundcolor = new uiframework.PropertyColor("Primary Background Color", "#3f3f46", ".drawer-header|.form-header", "background-color");
                this.formheaderbackgroundcolor.visible = false;

                this.primarybackgroundcolor = new uiframework.PropertyColor("Primary Background Color", "#333333", ".property|.drawer|.form|.property-combobox .combobox-editor|.grid", "background-color");
                this.primarybackgroundcolor.visible = false;
                this.secondarybackgroundcolor = new uiframework.PropertyColor("Secondary Background Color", "#1e1e1e", ".grid.content-area .property-container|.property-category|", "background-color");
                this.secondarybackgroundcolor.visible = false;

                if ($CANVAS) {
                    $CANVAS.settings.background = "#2d2d30";
                    $CANVAS.settings.axis = "#CCC";
                    $CANVAS.settings.major = "#111";
                    $CANVAS.settings.minor = "#222";
                    $CANVAS.settings.ruler = "#DDD";
                    $CANVAS.settings.rulertext = "#FFF";
                    $CANVAS.settings.fontcolor = "#FFF";
                }

                if ($MODEL) {
                    if ($MODEL.settings.dimtextcolor) {
                        $MODEL.settings.dimtextcolor.value = "#FFF";
                        $MODEL.settings.dimlinecolor.value = "#00B200";

                        //$MODEL.settings.sectionlinecolor.value = "#00B200";
                        $MODEL.settings.sectionfillcolor.value = "rgba(0, 255, 100, 0)";
                    }
                }

            }
        }
    };

    this.UnitChanged = function () {
        if ($SETTINGS) {

//            switch ($SETTINGS.unit.value) {
//                case UNIT.SI:
//                case UNIT.METRIC:
//                    $SETTINGS.nodigits.value = DIGITS.ZERO;
//                    break;
//                case UNIT.US:
//                    $SETTINGS.nodigits.value = DIGITS.TWO;
//                    break;
//            }

//            $SETTINGS.nodigits.UpdateText();
        }
    };

    this.Format = function (value) {
        return common.FormatNumber(value, this);
    };

    this.UpdateCSS = function () {
        if (this.fontsize) {

            var val = this.fontsize.value.value;
            $(".list-thumbnail span").css("font-size", 13 + val);
            $(".property-category").css("font-size", 13 + val);
            $(".property-name").css("font-size", 13 + val);
            $(".property-combobox span").css("font-size", 13 + val);
        }

        if ($ENABLETHEME) {

            this.InitializeTheme();

            var obj = this.toolbartextcolor;
            var res = obj.atribclass.split("|");
            for (var i = 0; i < res.length; i++) {
                $(res[i]).css(obj.atrib, obj.value);
            }

            obj = this.toolbarbackgroundcolor;
            var res = obj.atribclass.split("|");
            for (var i = 0; i < res.length; i++) {
                $(res[i]).css(obj.atrib, obj.value);
            }

            obj = this.primarytextcolor;
            var res = obj.atribclass.split("|");
            for (var i = 0; i < res.length; i++) {
                $(res[i]).css(obj.atrib, obj.value);
            }

            obj = this.secondarytextcolor;
            var res = obj.atribclass.split("|");
            for (var i = 0; i < res.length; i++) {
                $(res[i]).css(obj.atrib, obj.value);
            }

            obj = this.primarybackgroundcolor;
            var res = obj.atribclass.split("|");
            for (var i = 0; i < res.length; i++) {
                $(res[i]).css(obj.atrib, obj.value);
            }

            obj = this.secondarybackgroundcolor;
            var res = obj.atribclass.split("|");
            for (var i = 0; i < res.length; i++) {
                $(res[i]).css(obj.atrib, obj.value);
            }

            obj = this.appbackgroundcolor1;
            var res = obj.atribclass.split("|");
            for (var i = 0; i < res.length; i++) {
                $(res[i]).css(obj.atrib, obj.value);
            }

            obj = this.formheaderbackgroundcolor;
            var res = obj.atribclass.split("|");
            for (var i = 0; i < res.length; i++) {
                $(res[i]).css(obj.atrib, obj.value);
            }

        }

        var obj = this.textcolor;

        if (obj && obj.atribclass !== undefined) {
            var res = obj.atribclass.split("|");
            for (var i = 0; i < res.length; i++) {
                $(res[i]).css(obj.atrib, obj.value);
            }
        }

    };

    this.UnitChanged = function () {

        var i = 0;
        //$SETTINGS.updatesettingstext();
        //$SETTINGS.applychanges();

    };

};

common.FormatNumber = function (value, settings, withparenthesis) {
    if (typeof numeral !== 'function') {
        console.log("ERROR: Include this script: <script src='js/others/numeral.min.js' type='text/javascript'></script>");
        return value + "<span class='error'>E</span>";
    }

    if (settings.showexponent.value || Math.abs(value) > $MAXDIGIT) {
        if (value) {
            if (withparenthesis)
                return "(" + value.toExponential(settings.nodigits.value.id) + ")";

            else if (value.toExponential)
                return value.toExponential(settings.nodigits.value.id);

            else
                return value;
        } else
            return value;
    } else {

        if (value && value.replace)
            value = value.replace(",", "");

        value = parseFloat(value);

        switch (settings.digitsymbol.value.value) {
            case DIGITSYMBOL.COMMA.value:
                if (!isNaN(value)) {
                    var min = Math.pow(0.1, settings.nodigits.value.id);

                    if (common.IsZero(value) || Math.abs(value) > Math.abs(min)) {
                        var svalue = numeral(value).format("0." + settings.nodigits.value.value);
                        value = parseFloat(svalue);

                        //if (value % 1 !== 0)
                        return numeral(value).format("0,0." + settings.nodigits.value.value);
                        //else
                        //    return numeral(value).format("0,0");

                    } else if (settings.showexponent.value || Math.abs(value) > $MAXDIGIT || Math.abs(value) < 1) {
                        if (withparenthesis)
                            return "(" + value.toExponential(settings.nodigits.value.id) + ")";
                        else
                            return value.toExponential(settings.nodigits.value.id);
                    } else
                        return value;
                } else
                    return value;

            case DIGITSYMBOL.SPACE.value:
                if (!isNaN(value)) {
                    var min = Math.pow(0.1, settings.nodigits.value.id);

                    if (common.IsZero(value) || Math.abs(value) > Math.abs(min)) {
                        var svalue = numeral(value).format("0." + settings.nodigits.value.value);
                        value = parseFloat(svalue);

                        //if (value % 1 !== 0)
                        var n = value.toLocaleString("ca-ES", {minimumFractionDigits: settings.nodigits.value.id});

                        var nfinal = n.replace('.', ' ');
                        while (nfinal.indexOf(".") !== -1)
                            nfinal = nfinal.replace('.', ' ');

                        return nfinal;
//                        return numeral(value).format("0 0." + settings.nodigits.value.value);
                        //else
                        //    return numeral(value).format("0 0");

                    } else if (settings.showexponent.value || Math.abs(value) > $MAXDIGIT || Math.abs(value) < 1) {
                        if (withparenthesis)
                            return "(" + value.toExponential(settings.nodigits.value.id) + ")";
                        else {
                            var v = value.toExponential(settings.nodigits.value.id);
                            return v.replace(".", ",");
                        }
                    } else
                        return value;
                } else
                    return value;
        }

        if (!isNaN(value))
            return numeral(value).format("0." + settings.nodigits.value.value);
        else
            return value;
    }
};

common.Convert = function (value, from, to) {
    if (value !== undefined)
        return value * to.value / from.value;
    else
        return value;
};

common.IsZero = function (value) {
    if (Math.abs(value) < 0.0000000001)
        return true;
    return false;
};

function GetEnumList(enums) {
    var list = [];

    for (var name in enums) {
        if (enums[name].name === undefined)
            enums[name].name = name;

        list.push(enums[name]);
    }

    return list;
}

function GetEnum(enums, value) {
    var list = GetEnumList(enums);

    for (var c = 0; c < list.length; c++) {
        if (list[c].name === value) {
            return list[c];
        }
    }

    return undefined;
}

function GetRebarSize(size) {
    return GetEnum($SETTINGS.rebarset.value.rebar, size);
}

function ComputeInterval(number) {
    var root = Math.round(Math.log(number) / Math.LN10);
    var range = Math.round(number / Math.pow(10, root));

    if (range === 0) {
        range = Math.round(number);
        root -= 1;
    }

    var result;

    if (range > 7)
        result = 10;
    else if (range > 5)
        result = 5;
    else if (range > 2)
        result = 5;
    else
        result = 1;

    return result * Math.pow(10, root);
}

function RoundNearest(number) {
    var root = Math.floor(Math.log(Math.abs(number)) / Math.LN10);
    var range = Math.round(number / Math.pow(10, root));

    if (range === 0) {
        range = Math.round(number);
        root -= 1;
    }

    if (number >= 0)
        return range * Math.pow(10, root);
    else
        return -range * Math.pow(10, root);
}

//Services
var APICallType = {
    GET: {value: 0},
    POST: {value: 1}
};

function APICall(type, url, func, data, object) {
    switch (type) {
        case APICallType.GET:

            $.ajax({
                type: 'GET',
                url: url,
                contentType: 'application/json; charset=utf-8',
                async: true,
                cache: false,
                success: function (data) {
                    func(data, object);
                },
                error: function (data) {
                    func(data, object);
                }
            });

            break;

        case APICallType.POST:
            $.support.cors = true;
            $.ajax({
                type: 'POST',
                crossDomain: true,
                contentType: 'application/json; charset=utf-8',
                data: data,
                url: url,
                async: true,
                cache: false,
                success: function (data) {
                    func(data, object);
                },
                error: function (data) {
                    func(data, object);
                }
            });

            break;
    }
}


//Entities

common.Point2F = function (x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color;
    this.thickness = 1;

    this.Rotate = function (cx, cy, angle) {
        var a = Math.PI * angle / 180;
        var x = this.x;
        var y = this.y;

        this.x = cx + Math.cos(a) * (x - cx) - Math.sin(a) * (y - cy);
        this.y = cy + Math.sin(a) * (x - cx) + Math.cos(a) * (y - cy);
    };

    this.Move = function (dx, dy) {
        this.x += dx;
        this.y += dy;
    };

    this.Equal = function (point) {
        if (this.x === point.x && this.y === point.y)
            return true;

        return false;
    };
};

common.Line2F = function (x1, y1, x2, y2) {

    this.point1 = new common.Point2F(x1, y1);
    this.point2 = new common.Point2F(x2, y2);

    this.GetPointIntersection = function (point, tolerance) {
        if (this.IsHorizontal()) {
            if (this.InBetweenX(point.x)) {
                if (common.WithinTolerance(this.point1.y, point.y, tolerance))
                    return new common.Point2F(point.x, this.point1.y);
            }
        } else if (this.IsVertical()) {
            if (this.InBetweenY(point.y)) {
                if (common.WithinTolerance(this.point1.x, point.x, tolerance))
                    return new common.Point2F(this.point1.x, point.y);
            }
        } else if (this.InBetweenX(point.x) && this.InBetweenY(point.y)) {
            var x = this.point1.x - this.point2.x;
            var y = this.point1.y - this.point2.y;
            var ratio = y / x;

            var value = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            var tolerancex = Math.abs(value * tolerance / x);
            var tolerancey = Math.abs(value * tolerance / y);

            if (this.InBetweenXWithTolerance(point.x, tolerancex) && this.InBetweenYWithTolerance(point.y, tolerancey)) {

                if (Math.abs(x) > Math.abs(y)) {
                    var compy = this.point1.y - (this.point1.x - point.x) * ratio;
                    if (common.WithinTolerance(compy, point.y, tolerancex))
                        return new common.Point2F(point.x, compy);
                } else {
                    var compx = this.point1.x - (this.point1.y - point.y) / ratio;
                    if (common.WithinTolerance(compx, point.x, tolerancey))
                        return new common.Point2F(compx, point.y);
                }
            }
        }

        return null;
    };

    this.GetLineIntersection = function (line) {
        var slope1 = this.GetSlope();
        var b1 = 0;

        if (slope1 !== null)
            b1 = this.GetIntercept(slope1);

        var slope2 = line.GetSlope();
        var b2 = 0;

        if (slope2 !== null)
            b2 = line.GetIntercept(slope2);

        var intersection;

        var x;
        var y;

        if (slope1 === null) {
            if (slope2 === null) {
                return null;
            }

            y = slope2 * this.point1.x + b2;
            intersection = new common.Point2F(this.point1.x, y);
        } else if (slope2 === null) {
            y = slope1 * line.point2.x + b1;
            intersection = new common.Point2F(line.point2.x, y);
        } else {
            x = (b2 - b1) / (slope1 - slope2);
            y = slope1 * x + b1;
            intersection = new common.Point2F(x, y);
        }

        if (this.GetPointIntersection(intersection, 0.1) !== null)
            return intersection;

        return;
    };

    this.GetX = function (y) {
        var slope1 = this.GetSlope();
        var b1 = 0;

        if (slope1 !== null)
            b1 = this.GetIntercept(slope1);

        var x = (y - b1) / slope1;
        return x;
    };

    this.GetY = function (x) {
        var slope1 = this.GetSlope();
        var b1 = 0;

        if (slope1 !== null)
            b1 = this.GetIntercept(slope1);

        var y = slope1 * x + b1;
        return y;
    };

    this.GetIntercept = function (slope) {
        return this.point1.y - slope * this.point1.x;
    };

    this.GetSlope = function () {
        var x = this.point1.x - this.point2.x;
        var y = this.point1.y - this.point2.y;

        if (x === 0)
            return null;

        return y / x;
    };

    this.GetLength = function () {
        return Math.sqrt(Math.pow(this.point1.x - this.point2.x, 2) + Math.pow(this.point1.y - this.point2.y, 2));
    };

    this.GetAngle = function () {
        if (this.point1.x === this.point2.x) {
            if (this.point1.y > this.point2.y)
                return 90;
            else
                return 270;
        } else {
            var x = (this.point2.x - this.point1.x);
            var y = (this.point1.y - this.point2.y);

            var angle = (Math.atan(y / x) * (180 / Math.PI));

            if (x > 0) {
                if (y > 0)
                    return angle;
                else
                    return 360 + angle;
            } else {
                return 180 + angle;
            }

            return angle;
        }
    };

    this.GetAngleRad = function () {
        if (this.point1.x === this.point2.x) {
            if (this.point1.y > this.point2.y)
                return Math.PI / 2;
            else
                return 1.5 * Math.PI;

        } else if (this.point1.y === this.point2.y) {
            return 0;

        } else {
            var x = (this.point2.x - this.point1.x);
            var y = (this.point1.y - this.point2.y);

            var angle = Math.atan(y / x);

            if (x > 0) {
                if (y > 0)
                    return angle;
                else
                    return Math.PI * 2 + angle;
            } else {
                return Math.PI + angle;
            }

            return angle;
        }
    };

    this.Split = function (number) {
        if (number < 2)
            return;

        var points = [];
        var intervalx = (this.point2.x - this.point1.x) / (number);
        var intervaly = (this.point2.y - this.point1.y) / (number);

        points.push(new common.Point2F(this.point1.x, this.point1.y));

        for (var count = 1; count < number; count++) {
            points.push(new common.Point2F(intervalx * count + this.point1.x, intervaly * count + this.point1.y));
        }

        points.push(new common.Point2F(this.point2.x, this.point2.y));

        return points;
    };

    this.GetPointsBySpacing = function (spacing) {
        if (spacing <= 0)
            return this.GetPointsByCount(2);

        var length = this.GetLength();

        if (length !== 0) {
            var number = Math.ceil(length / spacing) + 1;
            var points = [];
            var intervalx = (this.point2.x - this.point1.x) / (number - 1);
            var intervaly = (this.point2.y - this.point1.y) / (number - 1);

            for (var count = 0; count < number; count++) {
                points[count] = new common.Point2F(intervalx * count + this.point1.x, intervaly * count + this.point1.y);
            }

            return points;
        }

        return null;
    };

    this.GetStartOffset = function (offset) {
        var ratio = offset / this.GetLength();
        var diffx = (this.point2.x - this.point1.x);
        var diffy = (this.point2.y - this.point1.y);

        return new common.Point2F(ratio * diffx + this.point1.x, ratio * diffy + this.point1.y);
    };

    this.GetStartOffsetByRatio = function (ratio) {
        var diffx = (this.point2.x - this.point1.x);
        var diffy = (this.point2.y - this.point1.y);

        return new common.Point2F(ratio * diffx + this.point1.x, ratio * diffy + this.point1.y);
    };

    this.GetEndOffset = function (offset) {
        var ratio = offset / this.GetLength();
        var diffx = (this.point2.x - this.point1.x);
        var diffy = (this.point2.y - this.point1.y);

        return new common.Point2F(this.point2.x - ratio * diffx, this.point2.y - ratio * diffy);
    };

    this.GetMidPoint = function () {
        return new common.Point2F((this.point1.x + this.point2.x) / 2, (this.point1.y + this.point2.y) / 2);
    };

    this.InBetweenXWithTolerance = function (x, tolerance) {
        if (this.point1.x < this.point2.x) {
            if (((this.point1.x - tolerance) < x) && ((this.point2.x + tolerance) > x))
                return true;
            else if (((this.point1.x + tolerance) > x) && ((this.point2.x - tolerance) < x))
                return true;
        } else {
            if (((this.point2.x - tolerance) < x) && ((this.point1.x + tolerance) > x))
                return true;
            else if (((this.point2.x + tolerance) > x) && ((this.point1.x - tolerance) < x))
                return true;
        }

        return false;
    };

    this.InBetweenX = function (x) {
        if (this.point1.x < this.point2.x) {
            if ((this.point1.x < x) && (this.point2.x > x))
                return true;
        } else {
            if ((this.point1.x > x) && (this.point2.x < x))
                return true;
        }

        return false;
    };

    this.InBetweenYWithTolerance = function (y, tolerance) {
        if (this.point1.y < this.point2.y) {
            if (((this.point1.y - tolerance) < y) && ((this.point2.y + tolerance) > y))
                return true;
        } else {
            if (((this.point1.y + tolerance) > y) && ((this.point2.y - tolerance) < y))
                return true;
        }

        return false;
    };

    this.InBetweenY = function (y) {
        if (this.point1.y < this.point2.y) {
            if ((this.point1.y < y) && (this.point2.y > y))
                return true;
        } else {
            if ((this.point1.y > y) && (this.point2.y < y))
                return true;
        }

        return false;
    };

    this.InBetween = function (x, y) {
        if (this.InBetweenX(x) && this.InBetweenY(y))
            return true;

        return false;
    };

    this.IsHorizontal = function () {
        if (Math.abs(this.point1.y - this.point2.y) < common.orientationtolerance)
            return true;

        return false;
    };

    this.IsVertical = function () {
        if (Math.abs(this.point1.x - this.point2.x) < common.orientationtolerance)
            return true;

        return false;
    };

    this.UpdateLength = function (l) {
        if (this.IsHorizontal()) {
            if (this.point2.x > this.point1.x)
                this.point2.x = this.point1.x + l;
            else
                this.point2.x = this.point1.x - l;
        } else if (this.IsVertical()) {
            if (this.point2.y > this.point1.y)
                this.point2.y = this.point1.y + l;
            else
                this.point2.y = this.point1.y - l;
        } else {
            var length = this.GetLength();
            var dx = this.point2.x - this.point1.x;
            var dy = this.point2.y - this.point1.y;

            this.point2.x = this.point1.x + (l * dx) / length;
            this.point2.y = this.point1.y + (l * dy) / length;
        }
    };

    this.Move = function (x, y) {
        this.point1.x += x;
        this.point1.y += y;
        this.point2.x += x;
        this.point2.y += y;
    };

    this.Rotate = function (cx, cy, angle) {
        if (angle !== 0) {
            this.point1.Rotate(cx, cy, angle);
            this.point2.Rotate(cx, cy, angle);
        }
    };
};

common.Line3F = function (x1, y1, z1, x2, y2, z2) {
    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;

    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;

    this.Length = function () {
        return Math.sqrt((this.x1 - this.x2) * (this.x1 - this.x2) + (this.y1 - this.y2) * (this.y1 - this.y2) + (this.z1 - this.z2) + (this.z1 - this.z2));
    };

    this.GetPoint = function (le) {
        var x = this.x1 - this.x2;
        var y = this.y1 - this.y2;
        var z = this.z1 - this.z2;
        var ky;
        var kz;

        var x3;
        var y3;
        var z3;

        if (x === 0 && y === 0) {
            if (this.z1 < this.z2)
                return new common.Point3F(this.x1, this.y1, this.z1 + le);
            else
                return new common.Point3F(this.x1, this.y1, this.z1 - le);
        }

        if (x === 0 && z === 0) {
            if (this.y1 < this.y2)
                return new common.Point3F(this.x1, this.y1 + le, this.z1);
            else
                return new common.Point3F(this.x1, this.y1 - le, this.z1);
        }

        if (y === 0 && z === 0) {
            if (this.x1 < this.x2)
                return new common.Point3F(this.x1 + le, this.y1, this.z1);
            else
                return new common.Point3F(this.x1 - le, this.y1, this.z1);
        }

        if (z === 0) {
            var ky = Math.abs(x / y);

            if (this.y1 < this.y2) {
                if (le !== 0)
                    y3 = this.y1 + le / Math.sqrt(ky * ky + 1);
                else
                    y3 = this.y1;

                if (this.x1 < this.x2)
                    x3 = this.x1 + (y3 - this.y1) * ky;
                else
                    x3 = this.x1 - (y3 - this.y1) * ky;
            } else {
                if (le !== 0)
                    y3 = this.y1 - le / Math.sqrt(ky * ky + 1);
                else
                    y3 = this.y1;

                if (this.x1 < this.x2)
                    x3 = this.x1 + (this.y1 - y3) * ky;
                else
                    x3 = this.x1 - (this.y1 - y3) * ky;
            }

            return new common.Point3F(x3, y3, this.z1);
        }

        if (y === 0) {
            var kz = x / z;

            if (le !== 0)
                z3 = this.z1 - le / Math.sqrt(kz * kz + 1);
            else
                z3 = this.z1;

            x3 = this.x1 - (this.z1 - z3) * kz;

            return new common.Point3F(x3, this.y1, z3);
        }

        if (x === 0) {
            var kz = y / z;

            if (le !== 0)
                z3 = this.z1 - le / Math.sqrt(kz * kz + 1);
            else
                z3 = this.z1;

            y3 = this.y1 - (this.z1 - z3) * kz;

            return new common.Point3F(this.x1, y3, z3);
        }

        var l = this.Length();
        var fx = x / l;
        var fy = y / l;
        var fz = z / l;

        x3 = this.x1 - fx * le;
        y3 = this.y1 - fy * le;
        z3 = this.z1 - fz * le;

        return new common.Point3F(x3, y3, z3);
    };
};

common.Polygon2F = function (points) {
    this.points = [];

    if (points !== undefined)
        this.points = points;

    this.IsInside = function (point) {
        var bounds = this.Bounds();
        var left = 0;
        var right = 0;
        var length = this.points.length;
        var line;

        for (var i = 0; i < length; i++) {
            if (i !== (length - 1))
                line = new common.Line2F(this.points[i + 1].x, this.points[i + 1].y, this.points[i].x, this.points[i].y);
            else
                line = new common.Line2F(this.points[0].x, this.points[0].y, this.points[i].x, this.points[i].y);

            if (line.InBetweenY(point.y)) {
                var compare = new common.Line2F(bounds.x1 - (bounds.x2 - bounds.x1), point.y, bounds.x2 * 2, point.y);
                var intersection = line.GetLineIntersection(compare);

                if (intersection) {
                    if (point.x > intersection.x)
                        left++;
                    else
                        right++;
                }
            }
        }

        if (((left % 2) !== 0) && ((right % 2) !== 0))
            return true;

        return false;
    };

    this.Bounds = function () {
        if (this.points.length > 0) {
            var max = new common.Point2F(this.points[0].x, this.points[0].y);
            var min = new common.Point2F(this.points[0].x, this.points[0].y);

            for (var i = 0; i < this.points.length; i++) {
                if (max.x < this.points[i].x)
                    max.x = this.points[i].x;

                if (min.x > this.points[i].x)
                    min.x = this.points[i].x;

                if (max.y < this.points[i].y)
                    max.y = this.points[i].y;

                if (min.y > this.points[i].y)
                    min.y = this.points[i].y;
            }

            var bounds = new common.Bounds2F();
            bounds.x1 = min.x;
            bounds.y1 = min.y;

            bounds.x2 = max.x;
            bounds.y2 = max.y;

            return bounds;
        }

        return null;
    };
};

common.List = function (name, value, list) {
    this.name = name;
    this.list = list;
    this.value = value;

    this.Clone = function () {
        var clone = new common.List(this.name, this.value, this.list);
        return clone;
    };

    this.SetValue = function (value) {
        if (this.list !== undefined) {
            for (var c = 0; c < this.list.list.length; c++) {
                if (this.list.list[c].name.value === value)
                    this.value = this.list.list[c];
            }
        } else
            this.value = value;
    };
};

common.ItemCollection = function (text, type) {
    this.text = text;
    this.list = [];
    this.event;
    this.type = type;
    this.addevent;
    this.importevent;

    var _this = this;

    this.collectionupdated = new Event('collectionupdated');

    this.OnCollectionUpdated = function (func) {
        document.addEventListener('collectionupdated', func);
    };

    this.Add = function (parent, sender) {
        var object = new sender.type();
        var list = JSON.stringify({"list": sender.list[0]});
        var newobject = $.extend(object, list);
        sender.push(newobject);
    };

    this.Clear = function () {
        this.list = [];
    };

    this.Delete = function (parent, sender) {
        if (sender.list.length !== 1) {
            for (var i = 0; i < sender.list.length; i++) {
                if (sender.list[i].selected) {
                    sender.list.splice(i, 1);
                    break;
                }
            }

            sender.collectionupdated.combobox = sender.combobox;
            sender.collectionupdated.collection = sender.collection;
            document.dispatchEvent(sender.collectionupdated);
        }
    };

    this.push = function (item) {
        item.id = this.list.length;
        this.list.push(item);

        this.collectionupdated.combobox = this.combobox;
        this.collectionupdated.collection = this.collection;

        document.dispatchEvent(this.collectionupdated);
    };

    this.UpdateTree = function (tree, append) {
        var node = new uiframework.TreeNode(this.text);

        if (this.node && append) {
            node = this.node;
            node.DisposeChildren();
            this.tree = tree;

        } else {
            tree.push(node);
            this.tree = tree;
            this.node = node;
        }

        var toolbar = new uiframework.Toolbar();
        var item = toolbar.Add(new uiframework.ToolbarButton("plus-circle"));
        item.highlight = false;

        item.event = function () {
            if (_this.addevent)
                _this.addevent();
        };

        item = toolbar.Add(new uiframework.ToolbarButton("download"));
        item.highlight = false;

        item.event = function () {
            if (_this.importevent)
                _this.importevent();
        };

        node.Add(toolbar);

        for (var i = 0; i < this.list.length; i++) {
            item = new uiframework.TreeNode(this.list[i].name.value, this.list[i]);
            node.Add(item);
        }
    };
};

common.FlipAlongX = function (points, x) {
    var dist;
    var output = [];

    for (var i = 0; i < points.length; i++) {
        dist = Math.abs(points[i].x - x);

        output.push(new common.Point2F(points[i].x, points[i].y));

        if (points[i].x > x)
            output[i].x = x - dist;
        else
            output[i].x = x + dist;
    }

    return output;
};

common.FlipAlongY = function (points, y) {
    var dist;
    var output = [];

    for (var i = 0; i < points.length; i++) {
        dist = Math.abs(points[i].y - y);

        output.push(new common.Point2F(points[i].x, points[i].y));

        if (points[i].y > y)
            points[i].y = y - dist;
        else
            points[i].y = y + dist;
    }

    return output;
};


//Bounds

common.Bounds2F = function (x1, y1, x2, y2) {
    this.x1 = Number.MAX_VALUE;
    this.y1 = Number.MAX_VALUE;
    this.x2 = -Number.MAX_VALUE;
    this.y2 = -Number.MAX_VALUE;

    if (x1 !== undefined)
        this.x1 = x1;

    if (x2 !== undefined)
        this.x2 = x2;

    if (y1 !== undefined)
        this.y1 = y1;

    if (y2 !== undefined)
        this.y2 = y2;


    this.Update = function (x, y) {
        if (this.x1 > x)
            this.x1 = x;

        if (this.y1 > y)
            this.y1 = y;

        if (this.x2 < x)
            this.x2 = x;

        if (this.y2 < y)
            this.y2 = y;
    };

    this.Expand = function (factor) {
        var x = this.x2 - this.x1;
        var y = this.y2 - this.y1;

        this.x1 -= x * factor;
        this.x2 += x * factor;

        this.y1 -= y * factor;
        this.y2 += y * factor;
    };
};

common.Bounds3F = function (x1, y1, z1, x2, y2, z2) {
    this.x1 = Number.MAX_VALUE;
    this.y1 = Number.MAX_VALUE;
    this.z1 = Number.MAX_VALUE;
    this.x2 = -Number.MAX_VALUE;
    this.y2 = -Number.MAX_VALUE;
    this.z2 = -Number.MAX_VALUE;

    if (x1 !== undefined)
        this.x1 = x1;

    if (x2 !== undefined)
        this.x2 = x2;

    if (y1 !== undefined)
        this.y1 = y1;

    if (y2 !== undefined)
        this.y2 = y2;

    if (z1 !== undefined)
        this.z1 = z1;

    if (z2 !== undefined)
        this.z2 = z2;
};


//Objects

common.Mouse = function () {
    this.ismousedown = false;
    this.down = new common.Point2F(0, 0);
    this.downsnap = new common.Point2F(0, 0);
    this.downsnaplist = [];
    this.current = new common.Point2F(0, 0);
    this.currentsnap = new common.Point2F(0, 0);
    this.previous = new common.Point2F(0, 0);
    this.previoussnap = new common.Point2F(0, 0);
    this.delta = 0;
    this.mousedowncount = 0;
};

common.DrawProperties = function () {
    this.transparency = .3;
    this.linecolor = "#000";
    this.fillcolor = "rgba(102, 153, 204, " + this.transparency + ")";
    this.textcolor = "#000";
    this.thickness = 1;
    this.scale = true;
    this.showfill = true;
    this.showline = true;
    this.pointcolor = false;

    this.SetTransparency = function (value) {
        var temp = this.fillcolor.split(",");
        if (this.fillcolor.startsWith("rgb(")) {
            this.fillcolor = this.fillcolor.replace("rgb", "rgba");
            this.fillcolor = this.fillcolor.replace(")", "");
            temp = this.fillcolor.split(",");
            this.fillcolor = temp[0] + "," + temp[1] + "," + temp[2] + "," + value + ")";
        } else if (this.fillcolor.startsWith("rgba("))
            this.fillcolor = temp[0] + "," + temp[1] + "," + temp[2] + "," + value + ")";

        this.transparency = value;
    };
};

common.TextProperties = function () {
    this.color = "#000";
    this.verticalalignment = "middle";
    this.horizontalaligment = "center";
};

//Functionalities

common.WithinTolerance = function (value, compare, tolerance) {
    if (((value - tolerance) <= compare) && ((value + tolerance) >= compare))
        return true;

    return false;
};

common.Snap = function (value, digit) {
    return Math.round(value / digit) * digit;
};

common.Round = function (value, digit) {
    var dec = Math.pow(10, digit);
    return Math.round(value * dec) / dec;
};

common.filterFloat = function (value) {
    if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
        .test(value))
        return Number(value);
    return null;
};

common.GenerateReport1 = function (properties) {
    var report = "";

    for (var name in properties)
        if (properties[name] !== undefined && properties[name].Load !== undefined) {
            report += properties[name].GenerateReport();
        }

    return report;
};

common.GenerateReport = function (properties, pdf, status) {
    for (var name in properties)
        if (properties[name] !== undefined && properties[name].Load !== undefined) {
            if (status.y >= status.h) {
                pdf.addPage();
                common.DrawHeader(pdf, status);
                common.DrawFooter(pdf, status);

                status.y = status.top;
            }

            properties[name].GenerateReport(pdf, status);
        }
};

common.DrawHeader = function (pdf, status, title) {
    pdf.setFontSize(10);
    pdf.setFontType('normal');
    pdf.text(status.left, status.top / 2, $REPORTTITLE);

    var today = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).split(' ').join('-');

    pdf.text(status.left + status.w, status.top / 2, today, "right");
};

common.DrawFooter = function (pdf, status) {
    pdf.setFontSize(10);
    pdf.setFontType('normal');

    pdf.text(status.left + status.w, status.h + status.top / 2, "Page " + status.page.toString(), "right");
    status.page++;
};

common.GeneratePDFReport = function (report, htmlObj) {
    var url = $SECTIONIMAGE;
    var source = htmlObj;

    specialElementHandlers = {
        // element with id of "bypass" - jQuery style selector
        '#bypassme': function (element, renderer) {
            // true = "handled elsewhere, bypass text extraction"
            return true;
        }
    };

    margins = {
        top: 80,
        bottom: 0,
        left: 80,
        right: 80
    };

    var cw = 1;
    var ch = 0;

    if ($CANVAS !== undefined) {
        cw = $CANVAS.width;
        ch = $CANVAS.height;
    }

    var pdf = new jsPDF('p', 'pt');

    var width = pdf.internal.pageSize.width;
    var height = pdf.internal.pageSize.height;

    var iw = width - margins.left - margins.right;
    var ih = iw * (ch / cw);

    var status = {};
    status.x = margins.left;
    status.y = margins.top + 10;
    status.w = iw;
    status.h = height - margins.top - margins.bottom;
    status.top = margins.top;
    status.left = margins.left;
    status.right = margins.right;
    status.bottom = margins.bottom;
    status.page = 1;

    common.DrawHeader(pdf, status);
    common.DrawFooter(pdf, status);

    //Draw report header
    pdf.setFontSize(14);
    pdf.setFontType('bold');

    pdf.text(status.x, status.y, $REPORTHEADER);
    status.y += ih + 26;

    var top = 26;

    if (url !== undefined)
        pdf.addImage(url, 'JPEG', margins.left, margins.top + top, iw, ih);

    pdf.setDrawColor(100, 100, 100);
    pdf.line(margins.left, margins.top + top, margins.left + iw, margins.top + top);
    pdf.line(margins.left, margins.top + ih + top, margins.left + iw, margins.top + ih + top);

    pdf.line(margins.left, margins.top + top, margins.left, margins.top + ih + top);
    pdf.line(margins.left + iw, margins.top + top, margins.left + iw, margins.top + ih + top);

    common.GenerateReport(report, pdf, status);

    if (uiframework.mobile) {

        try {

            var pdfOutput = pdf.output("blob");
            pdfmanager.SavePDF(pdfOutput).then(function (response) {
                if (response.status) {
                    sharingmanager.ShareWithOPtions("Sharing the report", "Cross-Section Properties", response.filepath);
                }
            }).catch(function (response) {
                common.ShowMessage($TITLE, "Error occurred while saving report:" + response.message);
            });

        } catch (e) {
            common.ShowMessage($TITLE, "Error occurred while saving report:" + e.toString());
        }


    } else {
        var pdfOutput = pdf.output("datauristring");

        var iframe = "<iframe width='100%' height='100%' src='" + pdfOutput + "'></iframe>";
        var x = window.open();
        x.document.open();
        x.document.write(iframe);
        x.document.close();
    }
};

common.ShowLogin = function (event) {
    var form = new uiframework.LoginForm();
    form.showclose = false;
    form.Bind(common.userinfo);

    form.okevent = function () {
        var user = common.userinfo;
        var username = user.username.value;
        var password = user.password.value;

        if (username !== "" && password !== "") {
            var url = common.url + "name=" + username + "&pass=" + password;
            common.ShowLoadingCursor();

            APICall(APICallType.POST, url, function (result) {
                if (result.status === "200") {
                    common.userinfo.sessionid = result["CSi Token"];
                    common.userinfo.Save();
                    form.Dispose();

                    if (event)
                        event();

                    common.loadcursor.remove();

                } else {
                    common.loadcursor.remove();
                    common.ShowMessage("Error", "Unable to login. Please check password or username.", "warning", function () {
                        form.Dispose();
                        common.ShowLogin();
                    });
                }
            });

        } else {
            //common.ShowLogin();
        }
    };

    form.Show();
    form.CenterPosition();

    return form;
};

common.LoginInformation = function () {
    this.header = new uiframework.PropertyCategory("SIGN IN");
    this.username = new uiframework.PropertyString("Username", "");
    this.password = new uiframework.PropertyString("Password", "", "password");
    this.date = new Date();

    this.Save = function () {
        var userobject = {};
        userobject.sessionid = common.userinfo.sessionid;

        if (uiframework.mobile) {
            userobject.username = common.userinfo.username.value;
            userobject.password = common.userinfo.password.value;
        }

        var userdetails = JSON.stringify(userobject);
        localStorage.setItem($APPCODE + ".account", userdetails);
    };

    this.Open = function () {
        //Open the previous user
        if (localStorage) {
            var user = localStorage.getItem($APPCODE + ".account");

            if (user !== null && user !== "null" && user !== "undefined") {
                user = JSON.parse(user);

                if (user.sessionid !== undefined)
                    this.sessionid = user.sessionid;

                if (user.username !== undefined)
                    this.username.value = user.username;

                if (user.password !== undefined)
                    this.password.value = user.password;

                this.date = new Date(user.date);
            }
        }
    };

    this.Clear = function () {
        this.password.SetValue("");
        localStorage.setItem($APPCODE + ".account", this.username.GetValue());
        localStorage.setItem(this.username.GetValue(), JSON.stringify(this));
    };
};

common.ShowMessage = function (title, message, icon, okfunc, cancelfunc, width, height, oktext, canceltext) {
    var form = new uiframework.Form(title);
    form.showclose = true;
    form.showcancel = false;
    form.okevent = okfunc;
    form.closeevent = cancelfunc;

    form.width = 300;
    form.height = 220;

    if (width)
        form.width = width;

    if (height)
        form.height = height;

    if (oktext)
        form.oktext = oktext;

    if (canceltext)
        form.canceltext = canceltext;

    var text;

    if (icon)
        text = "<div class='message'><i class='fa fa-" + icon + "'></i><p>" + message + "</p></div>";
    else
        text = "<div class='message'>" + message + "</div>";

    var message = new uiframework.GeneralHTML(text);
    form.Add(message);

    form.Show();
    form.CenterPosition();


};

common.ShowLoadingCursor = function (showbackground) {
    if (!common.loadcursor) {
        var cursor = "";

        if (showbackground) {
            cursor += "<div id='modal-cursor' class='modal'></div>";
        }

        cursor += "<div id='loadcursor' class='uil-spin-css' style='-webkit-transform:scale(0.6)'><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div>";
        $("body").append(cursor);

        common.loadcursor = $("#loadcursor");
        common.loadcursorbackground = $("#modal-cursor");
    }
};

common.HideLoadingCursor = function () {
    if (common.loadcursor) {
        common.loadcursor.remove();

        if (common.loadcursorbackground) {
            common.loadcursorbackground.remove();
            common.loadcursorbackground = undefined;
        }

        common.loadcursor = undefined;
    }
};

common.DisplayTestTitle = function (title) {
    $("body").append("<div class='title'>" + title + "</div>");
};

common.DisplayTestResult = function (title, input, output) {
    if (!$BODY)
        $BODY = $("body");

    if ((input === 0 && output === 0) || (input !== 0 && Math.abs((input - output) / input) < 0.05))
        $BODY.append("<div class='line'><div class='name'>" + title + ": </div><div class='status'>Passed! (" + input + " != " + output + ")</div></div>");
    else
        $BODY.append("<div class='line'><div class='name'>" + title + ": </div><div class='status failed'>Failed! (" + input + " != " + output + ")</div></div>");
};

common.Rotate = function (cx, cy, x, y, angle) {
    var rx = cx + Math.cos(angle) * (x - cx) - Math.sin(angle) * (y - cy);
    var ry = cy + Math.sin(angle) * (x - cx) + Math.cos(angle) * (y - cy);

    return new common.Point2F(rx, ry);
};

common.UpdateSection = function (section, settings) {
    if (section && settings.showdimension) {
        section.showdimlines = settings.showdimension.value;
        section.showdimsymbol = settings.showsymbol.value;
        section.showdimvalue = settings.showvalue.value;
        section.showunits = settings.showunit.value;

        if (section.property) {
            section.property.linecolor = settings.sectionlinecolor.value;
            section.property.fillcolor = settings.sectionfillcolor.value;
            section.property.SetTransparency(settings.sectiontransparency.value.value);
        }

        section.textcolor = settings.dimtextcolor.value;
        section.linecolor = settings.dimlinecolor.value;
        section.showlocalaxis = settings.showlocalaxis.value;
    }
};

common.AssignSettings = function (model, setting) {
    model.value = setting.value;
};

common.LoadSettings = function (storagename, settings) {
    if (localStorage) {
        var clone = localStorage.getItem(storagename);
        clone = JSON.parse(clone);

        if (clone && clone.length) {
            var item;

            for (var i = 0; i < clone.length; i++) {
                item = settings[clone[i][0]];

                if (item !== undefined) {
                    settings[clone[i][0]].value = clone[i][1];
                }
            }
        }
    }
};

common.SaveSettings = function (storagename, settings) {
    var clone = [];
    var setting;

    for (var name in settings) {
        if (settings[name] !== undefined) {
            if (settings[name].value !== undefined && !(settings[name] instanceof uiframework.PropertyCategory)) {
                if (settings[name].value.value) {
                    setting = {};
                    setting.name = settings[name].value.name;
                    setting.value = settings[name].value.value;

                    if (settings[name].value.id)
                        setting.id = settings[name].value.id;
                } else 
                    setting = settings[name].value;

                clone.push([name, setting]);
            }
        }
    }

    try {
        localStorage.setItem(storagename, JSON.stringify(clone));
    } catch (e) {
    }
};

common.RoundByFactor = function (number, factor) {
    return Math.round(number / factor) * factor;
};

common.LightenColor = function (color, factor) {
    if (color.toLowerCase().startsWith("rgba")) {
        var val = color.replace("rgba(", "").replace(")", "").replace(" ", "");
        var clrs = val.split(",");
        var r = parseInt(clrs[0]) + factor;
        var g = parseInt(clrs[1]) + factor;
        var b = parseInt(clrs[2]) + factor;
        var a = parseFloat(clrs[3]);

        r = (r < 0) ? 0 : r;
        g = (g < 0) ? 0 : g;
        b = (b < 0) ? 0 : b;

        r = (r > 255) ? 255 : r;
        g = (g > 255) ? 255 : g;
        b = (b > 255) ? 255 : b;

        return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
    } else if (color.toLowerCase().startsWith("rgb")) {
        var val = color.replace("rgb(", "").replace(")", "").replace(" ", "");
        var clrs = val.split(",");
        var r = parseInt(clrs[0]) + factor;
        var g = parseInt(clrs[1]) + factor;
        var b = parseInt(clrs[2]) + factor;

        r = (r < 0) ? 0 : r;
        g = (g < 0) ? 0 : g;
        b = (b < 0) ? 0 : b;

        r = (r > 255) ? 255 : r;
        g = (g > 255) ? 255 : g;
        b = (b > 255) ? 255 : b;

        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
    return color;
};

common.Romanize = function (num) {
    if (!+num)
        return false;
    var digits = String(+num).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
            "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
            "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
};

common.ShowAbout = function (header, text, showclose, showfooter, width, height, oktext) {
    var form = new uiframework.Form(header);

    form.showheader = true;
    form.showfooter = showfooter;
    form.showclose = showclose;

    if (oktext)
        form.oktext = oktext;

    text = "<div class='form-about'>" + text + "</div>";

    var html = new uiframework.GeneralHTML(text);
    form.Add(html);
    form.Show();

    if (window.innerWidth < common.mindockformsize)
        form.DockFullScreen();
    else {
        if (width)
            form.width = width;
        else
            form.width = 420;

        if (height)
            form.height = height;
        else
            form.height = 400;

        form.CenterPosition();
    }
};

common.Wait = function (func) {
    var timer = setTimeout(function () {
        if (func)
            func();

        clearTimeout(timer);
    }, 10);
};

common.RoundDimension = function (dimension, factor) {
    if (dimension) {
        d = dimension.GetValue();
        d = common.RoundByFactor(d, factor);
        dimension.value = d / dimension.unit.value.value;
    }
};

common.RoundDimension = function (dimension, factor) {
    if (dimension) {
        d = dimension.GetValue();
        d = common.RoundByFactor(d, factor);
        dimension.value = d / dimension.unit.value.value;
    }
};

common.RoundUp = function (dimension, factor) {
    if (dimension) {
        d = dimension.GetValue();
        d = Math.ceil(d / factor) * factor; //common.RoundByFactor(d, factor);
        dimension.value = d / dimension.unit.value.value;
    }
};

common.RoundDown = function (dimension, factor) {
    if (dimension) {
        d = dimension.GetValue();
        d = Math.floor(d / factor) * factor; //common.RoundByFactor(d, factor);
        dimension.value = d / dimension.unit.value.value;
    }
};

common.GetWindowWidth = function () {
    if (window.innerWidth !== 0)
        return window.innerWidth;
    else
        return window.outerWidth;
};

common.GetWindowHeight = function () {
    if (window.innerHeight !== 0)
        return window.innerHeight;
    else
        return window.outerHeight;
};

common.InitializeOSMargin = function () {
    var md = new MobileDetect(window.navigator.userAgent);
    var phone = md.phone();

    if (md.tablet() !== null || md.phone() !== null || md.mobile() !== null)
        uiframework.mobile = true;

    if (md.os)
        common.os = md.os();

    if (phone && phone.toLowerCase() === "iphone") {
        //iPhone X in portrait mode
        if ((common.GetWindowWidth() === 375 && common.GetWindowHeight() === 812)) {
            common.top = 30;
            common.left = 0;
            common.right = 0;

            $("body").css({"background-color": "#FFF"});

        } else if ((common.GetWindowWidth() === 812 && common.GetWindowHeight() === 375)) {
            common.top = 0;
            common.left = 30;
            common.right = 30;

            $("body").css({"background-color": "#000"});
        } else {
            //Other iPhone
            common.top = 10;
        }
    } else {
        if (common.os === "iOS") {
            //iPad
            common.top = 10;
        }
    }
};

common.InitializeBackButton = function () {
    $NAVIGATION = new navigationHelper();
    document.addEventListener("backbutton", function (e) {
        e.preventDefault();

        try {
            $NAVIGATION.PopView();
        } catch (e) {
        }
    }, false);
};

common.Clone = function(object) {
    return JSON.parse(JSON.stringify(object));
};

//Initialize Variable
common.unit = new commonunit(UNIT.US);
common.url = "https://cloud.america.com/user/rfm/proxy?";

$(document).ready(function () {
    common.userinfo = new common.LoginInformation();
    common.userinfo.Open();
});
