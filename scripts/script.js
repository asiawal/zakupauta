const database = [
  { id: 0, name: "Honda Jazz", price: 19900 },
  { id: 1, name: "Peugeot 206", price: 19900 },
  { id: 2, name: "Audi A4", price: 19000 },
  { id: 3, name: "Opel Astra", price: 18900 },
  { id: 4, name: "Kia Ceed", price: 18900 },
  { id: 5, name: "Fiat Grande Punto", price: 18500 },
  { id: 6, name: "Skoda Fabia", price: 17900 },
  { id: 7, name: "Ford Focus", price: 17900 },
  { id: 8, name: "Toyota Auris", price: 18900 },
  { id: 9, name: "Citroen C8", price: 18500 },
];

if (document.getElementById("listPage")) {
  const $buy = document.querySelectorAll(".buy");

  database.forEach((e) => {
    localStorage.setItem(e.id, JSON.stringify(e));
  });

  $buy.forEach((e) => {
    e.addEventListener("click", () => {
      let img = e.querySelector(".picture");
      localStorage.setItem("selectedCarID", JSON.stringify(e.id));
      localStorage.setItem("carImgURL", JSON.stringify(img.src));
      window.location.href = "form.html";
    });
  });
}

if (document.getElementById("formPage")) {
  const $backToListBtn = document.getElementById("backToList");
  const $customerForm = document.getElementById("customerForm");
  const $fullName = document.getElementById("fullName");
  const $date = document.getElementById("date");
  const $radios = document.getElementsByName("payment");
  const $checkboxes = document.querySelectorAll(
    "input[type=checkbox][name=accesories]"
  );
  const $total = document.getElementById("total");
  const accesories = [
    { id: 0, name: "Opony letnie", price: 1600, picked: false },
    { id: 1, name: "Opony zimowe", price: 1600, picked: false },
    { id: 2, name: "Dywaniki", price: 500, picked: false },
    { id: 3, name: "Klimatyzacja", price: 2000, picked: false },
  ];

  function addAccesoriestToTotal(checkbox) {
    if (checkbox.checked) {
      let selectedAccesories = JSON.parse(localStorage.getItem("accesories"));
      selectedAccesories[checkbox.id].picked = true;
      localStorage.setItem("accesories", JSON.stringify(selectedAccesories));
    } else {
      let selectedAccesories = JSON.parse(localStorage.getItem("accesories"));
      selectedAccesories[checkbox.id].picked = false;
      localStorage.setItem("accesories", JSON.stringify(selectedAccesories));
    }

    let selectedCar = JSON.parse(localStorage.getItem("selectedCar"));
    let sum = 0;
    let selectedAccesories = JSON.parse(localStorage.getItem("accesories"));
    selectedAccesories.forEach((accessory) => {
      if (accessory.picked) {
        sum += accessory.price;
      }
    });
    let totalPrice = selectedCar.price + sum;
    $total.innerText = totalPrice;
    localStorage.setItem("total", totalPrice);
  }

  // obsługa odświeżenia formularza
  window.addEventListener("load", () => {
    // uzupełnienie checkboxów
    if (localStorage.getItem("accesories") !== null) {
      let selectedAccesories = JSON.parse(localStorage.getItem("accesories"));
      selectedAccesories.forEach((accesory) => {
        if (accesory.picked) {
          $checkboxes[accesory.id].checked = true;
        }
      });
      $checkboxes.forEach((checkbox) => {
        addAccesoriestToTotal(checkbox);
      });
    }

    // uzupełnienie name'a
    if (localStorage.getItem("fullName") !== null) {
      $fullName.value = JSON.parse(localStorage.getItem("fullName"));
    }

    // uzupełnienie date'a
    if (localStorage.getItem("date") !== null) {
      $date.value = JSON.parse(localStorage.getItem("date"));
    }

    // setup radiosów
    let payment = localStorage.getItem("payment");
    if (payment === "cash") {
      $radios[1].checked = true;
    } else {
      $radios[0].checked = true;
    }
  });

  // przycisk do cofania do listy
  $backToListBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // przekazanie car ID z listy do formularza, ustawienie selectedCar w localstorage
  let carID = JSON.parse(localStorage.getItem("selectedCarID"));
  let selectedCar = JSON.parse(localStorage.getItem(carID));
  localStorage.setItem("selectedCar", JSON.stringify(selectedCar));

  // wyświetlenie ceny samochodu bez dodatków
  let totalPrice = selectedCar.price;
  localStorage.setItem("total", totalPrice);
  $total.innerText = totalPrice;

  // iteracja po metodzie płatności i jej zapisanie do localstorage
  for (let i = 0; i < $radios.length; i++) {
    if ($radios[i].checked) {
      localStorage.setItem("payment", $radios[i].value);
    }
    $radios[i].addEventListener("change", () => {
      if ($radios[i].checked) {
        localStorage.setItem("payment", $radios[i].value);
      }
    });
  }

  // ograniczenie możliwej do ustawienia daty (min 14 dni do przodu)
  const date = new Date();
  date.setDate(date.getDate() + 14);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = date.getFullYear();
  const minimumDate = yyyy + "-" + mm + "-" + dd;
  $date.setAttribute("min", minimumDate);

  // // zapisanie full name do localstorage po wprowadzeniu
  $fullName.addEventListener("input", () => {
    localStorage.setItem("fullName", JSON.stringify($fullName.value));
  });

  // zapiasnie daty odbioru do localstorage po wprowadzeniu
  $date.addEventListener("input", () => {
    localStorage.setItem("date", JSON.stringify($date.value));
  });

  // zapisanie listy akcesoriów do localstorage
  if (localStorage.getItem("accesories") === null) {
    localStorage.setItem("accesories", JSON.stringify(accesories));
  }

  // iteracja po checkboxach i dodanie ceny zaznaczonych do sumy
  $checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      addAccesoriestToTotal(checkbox);
    });
  });

  // wyswietlenie podsumowania
  $customerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    window.location.href = "summary.html";
  });
}

if (document.getElementById("summaryPage")) {
  const $pickedCarImg = document.getElementById("pickedCarImg");
  const $summaryList = document.getElementById("summaryList");
  const $mainPageButton = document.getElementById("returnToList");

  const selectedCar = JSON.parse(localStorage.getItem("selectedCar"));
  const accesories = JSON.parse(localStorage.getItem("accesories"));
  const src = JSON.parse(localStorage.getItem("carImgURL"));
  const date = JSON.parse(localStorage.getItem("date"));

  $pickedCarImg.src = src;

  $summaryList.setAttribute("style", "white-space: pre-line");

  $summaryList.textContent = selectedCar.name + "\r\n";
  $summaryList.textContent += selectedCar.price + " zł" + "\r\n";
  $summaryList.textContent += "Dodatkowe akcesoria: " + "\r\n";
  $summaryList.textContent += date + "\r\n";

  accesories.forEach((accessory) => {
    if (accessory.picked) {
      $summaryList.textContent += accessory.name + "\r\n";
    }
  });
  $mainPageButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  localStorage.clear();
}
