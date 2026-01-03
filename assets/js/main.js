/*=============== FILTERS TABS ===============*/
const tabs = document.querySelectorAll("[data-target]"),
    tabContents = document.querySelectorAll("[data-content]");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const target = document.querySelector(tab.dataset.target);

        tabContents.forEach(tc => {
            tc.classList.remove("filters__active");
        });
        target.classList.add("filters__active");

        tabs.forEach(t => {
            t.classList.remove("filter-tab-active");
        });
        tab.classList.add("filter-tab-active");
    });
});

/*=============== DARK LIGHT THEME ===============*/
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "ri-sun-line"; // Ikon yang akan muncul saat mode gelap (Matahari)

// Cek preferensi user sebelumnya (dari LocalStorage)
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

// Fungsi untuk mendapatkan tema saat ini
const getCurrentTheme = () =>
    document.body.classList.contains(darkTheme) ? "dark" : "light";
const getCurrentIcon = () =>
    themeButton.classList.contains(iconTheme) ? "ri-moon-line" : "ri-sun-line";

// Jika user pernah memilih tema sebelumnya
if (selectedTheme) {
    // Terapkan tema
    document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
        darkTheme
    );

    // Terapkan ikon yang benar
    if (selectedIcon === "ri-moon-line") {
        themeButton.classList.add("ri-moon-line");
        themeButton.classList.remove("ri-sun-line");
    } else {
        themeButton.classList.add("ri-sun-line");
        themeButton.classList.remove("ri-moon-line");
    }
}

// Event Listener saat tombol diklik
themeButton.addEventListener("click", () => {
    // 1. Toggle class dark-theme pada body
    document.body.classList.toggle(darkTheme);

    // 2. Ubah Ikon (Hapus Bulan, Tambah Matahari, atau sebaliknya)
    themeButton.classList.toggle("ri-sun-line");
    themeButton.classList.toggle("ri-moon-line");

    // 3. Simpan preferensi ke LocalStorage
    localStorage.setItem("selected-theme", getCurrentTheme());
    localStorage.setItem("selected-icon", getCurrentIcon());
});
/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: "top",
    distance: "60px",
    duration: 2500,
    delay: 400
});

sr.reveal(`.profile__border`);
sr.reveal(`.profile__name`, { delay: 500 });
sr.reveal(`.profile__profession`, { delay: 600 });
sr.reveal(`.profile__social`, { delay: 700 });
sr.reveal(`.profile__info-group`, { interval: 100, delay: 700 });
sr.reveal(`.profile__buttons`, { delay: 800 });
sr.reveal(`.filters__content`, { delay: 900 });
sr.reveal(`.filters`, { delay: 1000 });
