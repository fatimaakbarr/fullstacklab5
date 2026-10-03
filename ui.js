// ui.js - small DOM helpers shared by every task

export function renderCard(targetId, title, lines = [], borderClass = "") {
  const target = document.getElementById(targetId);
  const bodyHtml = lines
    .map((line) => `<p class="card-text mb-1">${line}</p>`)
    .join("");

  target.insertAdjacentHTML(
    "beforeend",
    `<div class="card mb-3 ${borderClass}">
       <div class="card-body">
         <h5 class="card-title">${title}</h5>
         ${bodyHtml}
       </div>
     </div>`
  );
}

// textContent (not innerHTML) so user-typed text can never inject markup
export function appendLine(targetId, text, extraClasses = "") {
  const paragraph = document.createElement("p");
  paragraph.className = `mb-1 ${extraClasses}`;
  paragraph.textContent = text;
  document.getElementById(targetId).appendChild(paragraph);
}

export function clearOutput(targetId) {
  document.getElementById(targetId).innerHTML = "";
}