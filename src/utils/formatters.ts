export function formatMeasurement(quantity: number | undefined | null): string {
    if (quantity === undefined || quantity === null) return "";
    
    // Parse it as a number in case it's passed as a string
    let num = Number(quantity);
    if (isNaN(num)) return quantity.toString();
    if (num === 0) return "0";

    const isNegative = num < 0;
    num = Math.abs(num);

    // Watch for edge cases of 0.98, 1.98, 2.01, etc.
    const rounded = Math.round(num);
    if (Math.abs(num - rounded) <= 0.05) {
        if (rounded === 0) return isNegative ? "-pinch" : "pinch";
        return (isNegative ? -rounded : rounded).toString();
    }

    let whole = Math.floor(num);
    let fraction = num - whole;

    let fractionStr = "";
    if (fraction < 0.1) {
        // Less than 0.1 is a pinch if there's no whole number.
        // If there's a whole number, we just ignore this small fractional part.
        fractionStr = whole === 0 ? "pinch" : "";
    } else if (fraction < 0.2) {
        fractionStr = "1/8";
    } else if (fraction < 0.3) {
        fractionStr = "1/4";
    } else if (fraction < 0.35) {
        fractionStr = "1/3";
    } else if (fraction < 0.45) {
        fractionStr = "3/8";
    } else if (fraction < 0.55) {
        fractionStr = "1/2";
    } else if (fraction < 0.65) {
        fractionStr = "5/8";
    } else if (fraction < 0.70) {
        fractionStr = "2/3";
    } else if (fraction < 0.80) {
        fractionStr = "3/4";
    } else if (fraction < 0.95) {
        fractionStr = "7/8";
    } else {
        whole += 1;
        fractionStr = "";
    }

    let result = "";
    if (whole === 0) {
        result = fractionStr;
    } else {
        result = fractionStr ? `${whole} ${fractionStr}` : whole.toString();
    }

    return isNegative ? `-${result}` : result;
}
