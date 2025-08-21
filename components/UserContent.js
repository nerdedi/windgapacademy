// User-generated content
export function showUserContent(container) {
  container.innerHTML = `
    <section id='user-content' aria-label='User Content'>
      <h2>📝 User Content</h2>
      <button id='upload-lesson'>Upload Lesson</button>
      <button id='share-tip'>Share Tip</button>
      <div id='content-feedback' aria-live='polite'></div>
    </section>
  `;
  document.getElementById("upload-lesson").onclick = function () {
    document.getElementById("content-feedback").innerText = "Lesson uploaded!";
  };
  document.getElementById("share-tip").onclick = function () {
    document.getElementById("content-feedback").innerText = "Tip shared!";
  };
}
