let currentFile = null;

// 選擇檔案
document.getElementById('fileInput').addEventListener('change', function(e) {
  handleFile(e.target.files[0]);
});

// 拖放檔案
const dropZone = document.getElementById('dropZone');

dropZone.addEventListener('dragover', function(e) {
  e.preventDefault();
  dropZone.style.background = '#f0f0f0';
});

dropZone.addEventListener('dragleave', function() {
  dropZone.style.background = '';
});

dropZone.addEventListener('drop', function(e) {
  e.preventDefault();
  dropZone.style.background = '';
  handleFile(e.dataTransfer.files[0]);
});

// 處理圖片
function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    alert('請選擇圖片檔案！');
    return;
  }

  currentFile = file;

  const reader = new FileReader();
  reader.onload = function(e) {
    const preview = document.getElementById('preview');
    preview.src = e.target.result;
    preview.hidden = false;
    document.getElementById('formatSelect').hidden = false;
  };
  reader.readAsDataURL(file);
}

// 轉換並下載
function convert(format) {
  if (!currentFile) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');

      // JPG 不支援透明，加白色背景
      if (format === 'jpg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      // 下載
      const link = document.createElement('a');
      const 原檔名 = currentFile.name.replace(/\.[^.]+$/, '');
      link.download = 原檔名 + '.' + format;
      link.href = canvas.toDataURL('image/' + format);
      link.click();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(currentFile);
}