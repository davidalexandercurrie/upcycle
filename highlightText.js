function highlightText(textToHighlight) {
  return textToHighlight
    .replace(/([r|>])?([<>~])(br>)?/g, (m, p1, p2, p3) => {
      // <br undefined < br
      return p1 != undefined
        ? m
        : p3 != undefined
        ? m
        : '<span class="brackets">' + p2 + '<span><span class="default"><span>';
    })
    .replace(/[\[\]\(\)~]/g, m => {
      return (
        '<span class="brackets">' + m + '<span><span class="default"><span>'
      );
    })
    .replace(/(default")|(class=")|(brackets")|(")/g, (m, p1, p2, p3, p4) => {
      return p1
        ? m
        : p2
        ? m
        : p3
        ? m
        : '<span class="math-dx">' + p4 + '<span><span class="default"><span>';
    })
    .replace(/(?<![a-zA-Z])(?<!:)(?<!\d)-?([0-9]*[.])?[0-9]+/g, m => {
      return m === "808" || m === "909"
        ? m
        : '<span class="numbers">' + m + '<span><span class="default"><span>';
    })
    .replace(/([\$\?])/g, m => {
      return (
        '<span class="operators">' + m + '<span><span class="default"><span>'
      );
    })
    .replace(/(<span>)?([*<>+-]?\|[*<>+-]?)/g, (m, p1, p2) => {
      return p1 != undefined
        ? p1
        : "" +
            '<span class="operators">' +
            p2 +
            '<span><span class="default"><span>';
    })
    .replace(/d\d/, m => {
      return (
        '<span class="math-dx">' +
        m +
        '<span><span class="default"><span></span>'
      );
    })
    .replace(
      /(\bsine\b|\bcosine\b|\bsquare\b|\btri\b|\bsaw\b|\bisaw\b|\brand\b|\birand\b)/g,
      m => {
        return (
          '<span class="oscs">' +
          m +
          '<span><span class="default"><span></span>'
        );
      }
    );
}
