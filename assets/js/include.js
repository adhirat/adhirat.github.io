function loadHTML(id, file) {
  const cached = sessionStorage.getItem(file);

  if (cached) {
    document.getElementById(id).innerHTML = cached;
    afterLoad();
    return;
  }

  fetch(file)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load ${file}`);
      }
      return response.text();
    })
    .then(html => {
      sessionStorage.setItem(file, html);
      document.getElementById(id).innerHTML = html;
      afterLoad();
    })
    .catch(error => console.error(error));
}

function afterLoad() {
  highlightActiveNav();
}

function highlightActiveNav() {
  const page = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav a").forEach(link => {
    if (link.getAttribute("href") === page) {
      link.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadHTML("header", "partials/header.html");
  loadHTML("footer", "partials/footer.html");
});
