export {
    uniqueColor,
    hsl_rgb,
    hsv_rgb,
    rgb_hex
}

function uniqueColor(s, v) {
    return (index, total) => {
        let h = 360 / total * index,
            rgb = hsl_rgb(h, s, v);
        return rgb_hex(rgb[0], rgb[1], rgb[2]);
    }
}

// hue [0-360]
// saturation [0-100]
// lightness [0-100]
function hsl_rgb(h, s, l) {
    let r, g, b, p, q;
    
    h = h / 360;
    s = s / 100;
    l = l / 100 ;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [
        Math.min(255, Math.round(r*255)),
		Math.min(255, Math.round(g*255)),
		Math.min(255, Math.round(b*255))
    ]
}

// hue [0-360]
// saturation [0-100]
// value [0-100]
function hsv_rgb(h, s, v) {
    let rgb, hi, f, p, q, t;

    s = s / 100;
    v = v / 100;

    hi = Math.floor((h / 60) % 6);
    f = (h / 60) - hi;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);

    switch (hi) {
        case 0: rgb = [v, t, p]; break;
        case 1: rgb = [q, v, p]; break;
        case 2: rgb = [p, v, t]; break;
        case 3: rgb = [p, q, v]; break;
        case 4: rgb = [t, p, v]; break;
        case 5: rgb = [v, p, q]; break;
    }

    var r = Math.min(255, Math.round(rgb[0] * 256)),
        g = Math.min(255, Math.round(rgb[1] * 256)),
        b = Math.min(255, Math.round(rgb[2] * 256));
    return [r, g, b];
}

// red [0-255]
// green [0-255]
// blue [0-255]
function rgb_hex(r, g, b) {
    let rgb = b | (g << 8) | (r << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
}

function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}