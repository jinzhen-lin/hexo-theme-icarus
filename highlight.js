const cheerio = require('cheerio');
var hljs = require('highlight.js');

// 设置具体的语言

module.exports = function(hexo) {
  var BREAK_LINE_REGEXP = /\r\n|\r|\n/g;

  function getLines(text) {
    if (text.length === 0) return [];
    return text.split(BREAK_LINE_REGEXP);
  }

  function getLinesCount(text) {
    return (text.trim().match(BREAK_LINE_REGEXP) || []).length;
  }

  function duplicateMultilineNodes(element) {
    const $ = cheerio;
    var nodes = element.children;
    for (var node in nodes) {
      if (nodes.hasOwnProperty(node)) {
        var child = nodes[node];
        if (getLinesCount($(child).toString()) > 0) {
          if ($(child).children.length > 1) {
            duplicateMultilineNodes(child);
          } else {
            duplicateMultilineNode($(child).parent());
            break
          }
        }

      }
    }
  }

  function duplicateMultilineNode(element) {
    var className = element.attr("class");
    if (!/hljs-/.test(className)) return;
    const $ = cheerio;
    var lines = getLines(element.html());
    var line = "";
    for (var i = 0, result = ''; i < lines.length; i++) {
      var lineText = lines[i].length > 0 ? lines[i] : ' ';
      span_node = $("<span></span>").html(lineText).addClass(className);
      result += span_node.toString();
    }
    element.html(result.trim());
  }

  function addLineNumbersBlockFor(inputHtml) {
    const $ = cheerio;

    var lines = getLines(inputHtml);
    if (lines[lines.length - 1].trim() === '') {
      lines.pop();
    }
    if (lines.length <= 1) {
      return inputHtml;
    }
    var html = "";
    var num_table = $("<ol class='hljs-ol-num'></ol>");
    var code_table = $("<ol class='hljs-ol-code'></ol>");
    for (var i = 0; i < lines.length; i++) {
      num_table.append("<li>" + "" + "</li>");
      code_table.append("<li><code>" + lines[i] + "\n</code></li>");
    }
    return num_table.toString() + code_table.toString();
  }

  function patchCodeHighlight(content) {
    const $ = cheerio.load(content, {
      decodeEntities: false,
      xmlMode: true
    });
    $('figure.highlight').addClass('hljs');
    $('figure.highlight .code .line span').each(function() {
      const classes = $(this).attr('class').split(' ');
      if (classes.length === 1) {
        $(this).addClass('hljs-' + classes[0]);
        $(this).removeClass(classes[0]);
      }
    });
    $("pre code.hljs").each(function(i, block) {
      //duplicateMultilineNodes(block);
      //var html_content = $(this).html();
      //html_content = addLineNumbersBlockFor(html_content);
      //$(this).html(html_content);
    });
    //$("pre code.hljs").parent("pre").addClass("code-hljs-pre");

    return $.html();
  }

  /**
   * Add .hljs class name to the code blocks and code elements
   */
  hexo.extend.filter.register('after_post_render', function(data) {
    data.content = data.content ? patchCodeHighlight(data.content) : data.content;
    data.excerpt = data.excerpt ? patchCodeHighlight(data.excerpt) : data.excerpt;
    return data;
  });
}