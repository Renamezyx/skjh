/**
 * 速查手册交互逻辑
 * 依赖：Zepto（index.html head）、helpData.js（window.helpData）
 */

// 从全局读取 FAQ 数据，结构为二维数组 [[{ title, content }, ...], ...]
const helpData = window.helpData;

// item 点击：切换 is-open 类 + 动态设置 max-height 展开/收起面板
// 箭头旋转由 CSS .help-drawer-item.is-open .help-drawer-trigger:after 控制
const items = $('.help-drawer-list').find('.help-drawer-item');

items.each(function () {
  $(this).on('click', function () {
    const $item = $(this);
    const $content = $item.find('.help-drawer-content');
    const isOpen = $item.hasClass('is-open');

    if (isOpen) {
      // 收起：移除展开态，高度归零
      $item.removeClass('is-open');
      $content.css('max-height', '0');
    } else {
      // 展开：添加展开态，高度取内容实际高度
      $item.addClass('is-open');
      $content.css('max-height', $content[0].scrollHeight + 'px');
    }
  });
});
