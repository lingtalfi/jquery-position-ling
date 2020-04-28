/**
 * Cheap adaptation from jquery.position method
 * found in here: https://github.com/jquery/jquery/blob/master/src/offset.js
 *
 * Note: I removed a few things that I found too complicated, such as hooks.
 * So, this is just a lesser version of jquery.position.
 *
 */


// offset() relates an element's border box to the document origin
// adapted from https://github.com/jquery/jquery/blob/master/src/offset.js
function offset(elem) {
    let rect, win;

    // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
    // Support: IE <=11+
    // Running getBoundingClientRect on a
    // disconnected node in IE throws an error
    if (!elem.getClientRects().length) {
        return {top: 0, left: 0};
    }
    // Get document-relative position by adding viewport scroll to viewport-relative gBCR
    rect = elem.getBoundingClientRect();
    win = elem.ownerDocument.defaultView;
    return {
        top: rect.top + win.pageYOffset,
        left: rect.left + win.pageXOffset
    };
}

// Matches dashed string for camelizing
var rdashAlpha = /-([a-z])/g;
// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/;
var rcustomProp = /^--/;
var cssPrefixes = ["Webkit", "Moz", "ms"],
    emptyStyle = document.createElement("div").style,
    vendorProps = {};

var cssNormalTransform = {
    letterSpacing: "0",
    fontWeight: "400"
};

var isAttached = function (elem) {
        return contains(elem.ownerDocument, elem);
    },
    composed = {composed: true};

// Support: IE 9 - 11+, Edge 12 - 18+
// Check attachment across shadow DOM boundaries when possible (gh-3504)
if (window.document.documentElement.getRootNode) {
    isAttached = function (elem) {
        return contains(elem.ownerDocument, elem) ||
            elem.getRootNode(composed) === elem.ownerDocument;
    };
}


// Return a vendor-prefixed property or undefined
// https://github.com/jquery/jquery/blob/812b4a1a837c049b85efb73603105b4245cb0e5c/src/css/finalPropName.js#L23
function vendorPropName(name) {

    // Check for vendor prefixed names
    var capName = name[0].toUpperCase() + name.slice(1),
        i = cssPrefixes.length;

    while (i--) {
        name = cssPrefixes[i] + capName;
        if (name in emptyStyle) {
            return name;
        }
    }
}

// Return a potentially-mapped vendor prefixed property
// https://github.com/jquery/jquery/blob/812b4a1a837c049b85efb73603105b4245cb0e5c/src/css/finalPropName.js#L23
function finalPropName(name) {
    var final = vendorProps[name];

    if (final) {
        return final;
    }
    if (name in emptyStyle) {
        return name;
    }
    return vendorProps[name] = vendorPropName(name) || name;
}


// Used by camelCase as callback to replace()
// https://github.com/jquery/jquery/blob/812b4a1a837c049b85efb73603105b4245cb0e5c/src/core/camelCase.js#L10
function fcamelCase(_all, letter) {
    return letter.toUpperCase();
}


// Convert dashed to camelCase
// https://github.com/jquery/jquery/blob/812b4a1a837c049b85efb73603105b4245cb0e5c/src/core/camelCase.js#L10
function camelCase(string) {
    return string.replace(rdashAlpha, fcamelCase);
}

// https://github.com/jquery/jquery/blob/812b4a1a837c049b85efb73603105b4245cb0e5c/src/css/var/getStyles.js
function getStyles(elem) {
    // Support: IE <=11+ (trac-14150)
    // In IE popup's `window` is the opener window which makes `window.getComputedStyle( elem )`
    // break. Using `elem.ownerDocument.defaultView` avoids the issue.
    var view = elem.ownerDocument.defaultView;

    // `document.implementation.createHTMLDocument( "" )` has a `null` `defaultView`
    // property; check `defaultView` truthiness to fallback to window in such a case.
    if (!view) {
        view = window;
    }

    return view.getComputedStyle(elem);
}

// Convert dashed to camelCase, handle vendor prefixes.
// Used by the css & effects modules.
// Support: IE <=9 - 11+, Edge 12 - 18+
// Microsoft forgot to hump their vendor prefix (#9572)
// adapted from https://github.com/jquery/jquery/blob/812b4a1a837c049b85efb73603105b4245cb0e5c/src/css/cssCamelCase.js#L10
function cssCamelCase(string) {
    return camelCase(string.replace(rmsPrefix, "ms-"));
}


// Note: an element does not contain itself
// https://github.com/jquery/jquery/blob/812b4a1a837c049b85efb73603105b4245cb0e5c/src/selector/contains.js
function contains(a, b) {
    var adown = a.nodeType === 9 ? a.documentElement : a,
        bup = b && b.parentNode;

    return a === bup || !!(bup && bup.nodeType === 1 && (

        // Support: IE 9 - 11+
        // IE doesn't have `contains` on SVG.
        adown.contains ?
            adown.contains(bup) :
            a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
    ));
}


// https://github.com/jquery/jquery/blob/812b4a1a837c049b85efb73603105b4245cb0e5c/src/css/curCSS.js#L5
function curCSS(elem, name, computed) {
    var ret;

    computed = computed || getStyles(elem);

    // getPropertyValue is needed for `.css('--customProperty')` (gh-3144)
    if (computed) {
        ret = computed.getPropertyValue(name) || computed[name];

        if (ret === "" && !isAttached(elem)) {
            ret = style(elem, name);
        }
    }

    return ret !== undefined ?

        // Support: IE <=9 - 11+
        // IE returns zIndex value as an integer.
        ret + "" :
        ret;
}

// Get and set the style property on a DOM Node
// adapted from https://github.com/jquery/jquery/blob/812b4a1a837c049b85efb73603105b4245cb0e5c/src/css.js
function style(elem, name) {

    // Don't set styles on text and comment nodes
    if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
        return;
    }

    // Make sure that we're working with the right name
    let origName = cssCamelCase(name),
        isCustomProp = rcustomProp.test(name),
        style = elem.style;

    // Make sure that we're working with the right name. We don't
    // want to query the value if it is a CSS custom property
    // since they are user-defined.
    if (!isCustomProp) {
        name = finalPropName(origName);
    }


    // Otherwise just get the value from the style object
    return style[name];

}


// adapted from https://github.com/jquery/jquery/blob/master/src/css.js
function getCss(elem, name, extra) {
    let val, num, hooks,
        origName = cssCamelCase(name),
        isCustomProp = rcustomProp.test(name);

    // Make sure that we're working with the right name. We don't
    // want to modify the value if it is a CSS custom property
    // since they are user-defined.
    if (!isCustomProp) {
        name = finalPropName(origName);
    }
    // Otherwise, if a way to get the computed value exists, use that
    if (undefined === val) {
        val = curCSS(elem, name);
    }

    // Convert "normal" to computed value
    if (val === "normal" && name in cssNormalTransform) {
        val = cssNormalTransform[name];
    }

    // Make numeric if forced or a qualifier was provided and val looks numeric
    if (extra === "" || extra) {
        num = parseFloat(val);
        return extra === true || isFinite(num) ? num || 0 : val;
    }

    return val;
}

// position() relates an element's margin box to its offset parent's padding box
// This corresponds to the behavior of CSS absolute positioning
// adapted from https://github.com/jquery/jquery/blob/master/src/offset.js
function position(elem) {
    let offsetParent, _offset, doc, parentOffset = {top: 0, left: 0};

    // position:fixed elements are offset from the viewport, which itself always has zero offset
    if ("fixed" === getCss(elem, "position")) {

        // Assume position:fixed implies availability of getBoundingClientRect
        _offset = elem.getBoundingClientRect();

    } else {
        _offset = offset(elem);

        // Account for the *real* offset parent, which can be the document or its root element
        // when a statically positioned element is identified
        doc = elem.ownerDocument;
        offsetParent = elem.offsetParent || doc.documentElement;
        while (offsetParent &&
        (offsetParent === doc.body || offsetParent === doc.documentElement) &&
        "static" === getCss(offsetParent, "position")) {
            offsetParent = offsetParent.parentNode;
        }
        if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {

            // Incorporate borders into its offset, since they are outside its content origin
            parentOffset = offset(offsetParent);
            parentOffset.top += getCss(offsetParent, "borderTopWidth", true);
            parentOffset.left += getCss(offsetParent, "borderLeftWidth", true);
        }
    }

    // Subtract parent offsets and element margins
    return {
        top: _offset.top - parentOffset.top - getCss(elem, "marginTop", true),
        left: _offset.left - parentOffset.left - getCss(elem, "marginLeft", true),
    };
}



module.exports = {
    position: position,
};