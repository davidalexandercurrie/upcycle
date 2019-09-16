function highlightText(textToHighlight) {
  return textToHighlight
    .replace(/([r|>])?([<>~])(br>)?/g, (m, p1, p2, p3) => {
      return p1 != undefined
        ? m
        : p3 != undefined
        ? m
        : '<span class="brackets">' + p2 + "</span>";
    })
    .replace(/[\[\]\(\)~]/g, m => {
      return '<span class="brackets">' + m + "</span>";
    })
    .replace(
      /(default")|(class=")|(brackets")|([",])/g,
      (m, p1, p2, p3, p4) => {
        return p1
          ? m
          : p2
          ? m
          : p3
          ? m
          : '<span class="math-dx">' + p4 + "</span>";
      }
    )
    .replace(
      /(?<![a-zA-Z])(?<!:)(?<!\d)()([0-9]*[.])?([0-9]+)/g,
      (m, p1, p2, p3) => {
        return m === "808" || m === "909"
          ? m
          : '<span class="numbers">' + m + "</span>";
      }
    )
    .replace(
      /([^\,"\|\s\>\[])(<\/span>)?(?<!math)(?<!z)(-)|(\s\-\s)|(?<!\<)(\/)|([\*])|(?<!\|)([\+])(?!\|)|(?<!math)(?<!z)(?<!\|)(-)(?!\|)/g,
      (m, p1, p2, p3, p4, p5, p6, p7, p8) => {
        return p4
          ? '<span class="math-ops">' + p4 + "</span>"
          : p5
          ? '<span class="math-ops">' + p5 + "</span>"
          : p6
          ? '<span class="math-ops">' + p6 + "</span>"
          : p7
          ? '<span class="math-ops">' + p7 + "</span>"
          : p8
          ? '<span class="numbers">' + p8 + "</span>"
          : p1 && p2 && p3
          ? p1 + p2 + '<span class="math-ops">' + p3 + "</span>"
          : p1 && !p2 && p3
          ? p1 + '<span class="math-ops">' + p3 + "</span>"
          : p4
          ? '<span class="math-ops">' + p4 + "</span>"
          : m;
      }
    )
    .replace(/([\$\?])/g, m => {
      return '<span class="operators">' + m + "</span>";
    })
    .replace(/(<\/span>)?([*<>+-]?\|[*<>+-]?)/g, (m, p1, p2) => {
      return p1
        ? p1 + '<span class="operators">' + p2 + "</span>"
        : '<span class="operators">' + p2 + "</span>";
    })
    .replace(/d\d/, m => {
      return '<span class="math-dx">' + m + "</span>";
    })
    .replace(
      /(\bsine\b|\bcosine\b|\bsquare\b|\btri\b|\bsaw\b|\bisaw\b|\brand\b|\birand\b)/g,
      m => {
        return '<span class="oscs" onmouseover="showDescription(this)">' + m + "</span>";
      }
    )
}


