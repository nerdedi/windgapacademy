// HealthyKitchenChallenge.js
// Life Skills Module: Windgap Academy Clubhouse Kitchen
// Interactive nutrition and cooking game using Australian brands

export class HealthyKitchenChallenge {
  constructor(container) {
    this.container = container;
    this.state = {
      step: 0,
      selectedIngredients: [],
      utensils: [],
      recipe: this.getRecipe(),
      progress: [],
      achievements: [],
      safetyReminders: [],
      nutrition: {},
    };
    this.brands = [
      { name: "Sanitarium", type: "wholegrain", img: "brands/sanitarium.png" },
      { name: "Helga’s", type: "bread", img: "brands/helgas.png" },
      { name: "Bega", type: "cheese", img: "brands/bega.png" },
      { name: "SPC", type: "fruit", img: "brands/spc.png" },
      { name: "Birds Eye", type: "vegetable", img: "brands/birdseye.png" },
      { name: "Coles", type: "egg", img: "brands/coles.png" },
      { name: "Woolworths", type: "milk", img: "brands/woolworths.png" },
      { name: "SunRice", type: "rice", img: "brands/sunrice.png" },
      { name: "Steggles", type: "chicken", img: "brands/steggles.png" },
      { name: "John West", type: "fish", img: "brands/johnwest.png" },
    ];
    this.utensils = [
      { name: "Knife", img: "utensils/knife.png" },
      { name: "Pan", img: "utensils/pan.png" },
      { name: "Pot", img: "utensils/pot.png" },
      { name: "Oven", img: "utensils/oven.png" },
      { name: "Cutting Board", img: "utensils/board.png" },
      { name: "Spoon", img: "utensils/spoon.png" },
      { name: "Tongs", img: "utensils/tongs.png" },
    ];
    this.achievementsList = [
      "Healthy Chef",
      "Safety Star",
      "Nutrition Expert",
      "Quick Cook",
      "Creative Combo",
    ];
    this.safetyTips = [
      "Wash your hands before cooking!",
      "Use the correct knife for chopping.",
      "Keep raw meat separate from veggies.",
      "Check food is cooked through before serving.",
      "Store leftovers safely in the fridge.",
    ];
    this.render();
  }

  getRecipe() {
    // Example: Chicken & Veggie Stir-Fry
    return {
      name: "Chicken & Veggie Stir-Fry",
      steps: [
        "Select healthy ingredients from the pantry.",
        "Wash hands and prepare the cutting board.",
        "Chop chicken and vegetables using the knife.",
        "Heat pan and add a small amount of oil.",
        "Cook chicken until browned, then add vegetables.",
        "Stir-fry until veggies are tender.",
        "Serve with steamed rice.",
        "Enjoy your healthy meal!",
      ],
      requiredIngredients: ["Steggles", "Birds Eye", "SunRice"],
      requiredUtensils: ["Knife", "Pan", "Cutting Board", "Spoon"],
      nutrition: {
        calories: 420,
        protein: "28g",
        carbs: "55g",
        fat: "8g",
        vitamins: ["A", "C", "B6"],
      },
    };
  }

  render() {
    this.container.innerHTML = `
      <section class="healthy-kitchen flex flex-col items-center p-8">
        <h2 class="text-3xl font-bold mb-4">Windgap Academy Clubhouse Kitchen</h2>
        <h3 class="text-xl font-semibold mb-2">Healthy Kitchen Challenge</h3>
        <div class="mb-4">Step ${this.state.step + 1}: ${this.state.recipe.steps[this.state.step]}</div>
        <div class="pantry mb-4">
          <h4>Choose Ingredients (Australian Brands)</h4>
          <div class="flex flex-wrap gap-2">
            ${this.brands.map((b) => `<button class="ingredient-btn" data-brand="${b.name}"><img src="${b.img}" alt="${b.name}" width="48"/><br>${b.name}</button>`).join("")}
          </div>
        </div>
        <div class="utensils mb-4">
          <h4>Select Utensils</h4>
          <div class="flex flex-wrap gap-2">
            ${this.utensils.map((u) => `<button class="utensil-btn" data-utensil="${u.name}"><img src="${u.img}" alt="${u.name}" width="48"/><br>${u.name}</button>`).join("")}
          </div>
        </div>
        <div class="actions mb-4">
          <button class="btn-next">Next Step</button>
        </div>
        <div class="safety mb-2 text-red-700 font-bold">${this.safetyTips[this.state.step % this.safetyTips.length]}</div>
        <div class="progress mb-2">Achievements: ${this.state.achievements.join(", ") || "None yet"}</div>
        <div class="nutrition mb-2">Nutrition: ${Object.keys(this.state.nutrition).length ? JSON.stringify(this.state.nutrition) : "Complete the meal to see nutrition info."}</div>
        <div class="canvas-area mb-4" style="width:400px;height:300px;background:#f8f8f8;border:1px solid #ccc;"></div>
      </section>
    `;
    this.attachEvents();
    this.updateCanvas();
  }

  attachEvents() {
    this.container.querySelectorAll(".ingredient-btn").forEach((btn) => {
      btn.onclick = () => {
        const brand = btn.getAttribute("data-brand");
        if (!this.state.selectedIngredients.includes(brand)) {
          this.state.selectedIngredients.push(brand);
          btn.classList.add("selected");
        }
      };
    });
    this.container.querySelectorAll(".utensil-btn").forEach((btn) => {
      btn.onclick = () => {
        const utensil = btn.getAttribute("data-utensil");
        if (!this.state.utensils.includes(utensil)) {
          this.state.utensils.push(utensil);
          btn.classList.add("selected");
        }
      };
    });
    this.container.querySelector(".btn-next").onclick = () => {
      if (this.state.step < this.state.recipe.steps.length - 1) {
        this.state.step++;
        // Achievements
        if (this.state.step === 2 && this.state.selectedIngredients.length >= 3) {
          this.state.achievements.push("Healthy Chef");
        }
        if (this.state.step === 3 && this.state.utensils.includes("Knife")) {
          this.state.achievements.push("Safety Star");
        }
        if (this.state.step === this.state.recipe.steps.length - 1) {
          this.state.nutrition = this.state.recipe.nutrition;
          this.state.achievements.push("Nutrition Expert");
        }
        this.render();
      }
    };
  }

  updateCanvas() {
    // Placeholder for adapted optics/canvas engine
    const area = this.container.querySelector(".canvas-area");
    area.innerHTML = `<div style="padding:2em;text-align:center;color:#888;">Cooking simulation will appear here.<br>Drag ingredients and utensils to interact.</div>`;
    // You can adapt the optics engine here for heat flow, mixing, etc.
  }
}
