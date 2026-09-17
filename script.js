document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const bmiForm = document.getElementById("bmiForm");
    const heightInput = document.getElementById("height");
    const weightInput = document.getElementById("weight");
    const errorBox = document.getElementById("errorBox");
    const errorMessage = document.getElementById("errorMessage");
    const resultsSection = document.getElementById("resultsSection");
    const bmiValueSpan = document.getElementById("bmiValue");
    const bmiCategorySpan = document.getElementById("bmiCategory");
    const gaugePointer = document.getElementById("gaugePointer");
    const adviceText = document.getElementById("adviceText");
    const adviceCard = document.querySelector(".advice-card");
    const resetBtn = document.getElementById("resetBtn");

    // Event Listeners
    bmiForm.addEventListener("submit", handleCalculate);
    resetBtn.addEventListener("click", handleReset);

    // Dynamic input validation listeners (clearing errors as the user types)
    heightInput.addEventListener("input", clearErrors);
    weightInput.addEventListener("input", clearErrors);

    /**
     * Handles Form Submission and calculations
     * @param {Event} event 
     */
    function handleCalculate(event) {
        event.preventDefault();

        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);

        // Validation Checks
        if (!validateInputs(height, weight)) {
            return;
        }

        // Calculation: BMI = weight (kg) / (height (m) * height (m))
        const bmi = weight / (height * height);
        const roundedBmi = parseFloat(bmi.toFixed(1));

        displayResults(roundedBmi);
    }

    /**
     * Validation Logic
     * Checks for standard issues, realistic inputs, and common unit errors.
     */
    function validateInputs(height, weight) {
        // Check 1: Empty Fields
        if (isNaN(height) || isNaN(weight)) {
            showError("Please fill out both the weight and height fields.");
            return false;
        }

        // Check 2: Values less than or equal to zero
        if (height <= 0 || weight <= 0) {
            showError("Please enter physical values greater than zero.");
            return false;
        }

        // Check 3: Safety range validation
        if (weight < 2 || weight > 650) {
            showError("Please enter a realistic weight value (between 2 kg and 650 kg).");
            return false;
        }

        // Catching a common UI error: height inputted in centimeters instead of meters (e.g. 175 instead of 1.75)
        if (height > 3.0) {
            showError("Double check height: Enter it in meters (e.g., 1.75 instead of 175 cm).");
            return false;
        }

        // Check 4: Extremely low non-realistic height value
        if (height < 0.3) {
            showError("Please enter a realistic height value above 0.3 meters.");
            return false;
        }

        clearErrors();
        return true;
    }

    /**
     * Calculates category details and displays the result elements
     * @param {number} bmi 
     */
    function displayResults(bmi) {
        let category = "";
        let cssClass = "";
        let advice = "";
        let adviceClass = "";

        // Determine category properties
        if (bmi < 18.5) {
            category = "Underweight";
            cssClass = "bg-underweight";
            adviceClass = "advice-underweight";
            advice = "Your BMI value indicates you are underweight. Consider consulting a healthcare provider or a dietitian to discuss balanced nutrition options.";
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            category = "Healthy Weight";
            cssClass = "bg-healthy";
            adviceClass = "advice-healthy";
            advice = "Excellent work! Your weight is in the healthy range. Maintaining a balanced diet and regular physical activity will help preserve your health status.";
        } else if (bmi >= 25.0 && bmi <= 29.9) {
            category = "Overweight";
            cssClass = "bg-overweight";
            adviceClass = "advice-overweight";
            advice = "Your BMI indicates an overweight classification. Making minor daily switches towards a nutrient-dense diet and mild aerobic routine can work wonders.";
        } else {
            category = "Obese";
            cssClass = "bg-obese";
            adviceClass = "advice-obese";
            advice = "Your BMI index is in the obese category. It is recommended to seek specialized guidance from health professionals to customize safe and sustainable long-term health changes.";
        }

        // 1. Update text displays
        bmiValueSpan.textContent = bmi;
        bmiCategorySpan.textContent = category;

        // 2. Set dynamic color classifications
        bmiCategorySpan.className = "category-badge"; // Reset classes
        bmiCategorySpan.classList.add(cssClass);

        // 3. Update active advice elements
        adviceText.textContent = advice;
        adviceCard.className = "advice-card"; // Reset classes
        adviceCard.classList.add(adviceClass);

        // 4. Update the visual gauge pointer
        updateGaugePointer(bmi);

        // 5. Expand & Reveal Results smooth transition
        resultsSection.classList.remove("hidden");
        // Trigger reflow to initiate opacity transition
        void resultsSection.offsetWidth;
        resultsSection.classList.add("show");

        // Scroll view slightly to align results perfectly on mobile
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150);
    }

    /**
     * Dynamically positions pointer on the color gradient range bar
     * Range spans from BMI 15 to BMI 35 (20 unit range)
     */
    function updateGaugePointer(bmi) {
        const minVal = 15;
        const maxVal = 35;
        let percentage = 0;

        if (bmi <= minVal) {
            percentage = 0;
        } else if (bmi >= maxVal) {
            percentage = 100;
        } else {
            // Normalize current calculation to a linear 0 to 100 span
            percentage = ((bmi - minVal) / (maxVal - minVal)) * 100;
        }

        gaugePointer.style.left = `${percentage}%`;
    }

    /**
     * Displays validation errors
     */
    function showError(message) {
        errorMessage.textContent = message;
        errorBox.classList.add("show");
        errorBox.setAttribute("aria-hidden", "false");
        
        // Hide stale results if an error has occurred
        resultsSection.classList.remove("show");
        setTimeout(() => {
            resultsSection.classList.add("hidden");
        }, 300);
    }

    /**
     * Clears error states
     */
    function clearErrors() {
        if (errorBox.classList.contains("show")) {
            errorBox.classList.remove("show");
            errorBox.setAttribute("aria-hidden", "true");
        }
    }

    /**
     * Clear all elements to defaults
     */
    function handleReset() {
        // Clear all native inputs
        heightInput.value = "";
        weightInput.value = "";
        
        // Hide modules smoothly
        clearErrors();
        resultsSection.classList.remove("show");
        
        setTimeout(() => {
            resultsSection.classList.add("hidden");
            // Reset position
            gaugePointer.style.left = "50%";
        }, 300);
    }
});