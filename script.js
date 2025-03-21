document.addEventListener("DOMContentLoaded", () => {
    const subjectsContainer = document.getElementById("subjects");

    // Fetch study cards from the JSON file
    fetch("content/study-cards.json")  // Ensure this path matches your folder structure
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load study cards.");
            }
            return response.json();
        })
        .then(data => {
            const subjects = data.subjects;

            subjects.forEach(subject => {
                const subjectKey = subject.name.toLowerCase().replace(/ /g, '-');
                const section = document.createElement("section");
                section.classList.add("subject-section", subjectKey);
                section.id = subjectKey;

                // Add an image for decoration (if available)
                const imageHTML = subject.image 
                    ? `<img src="images/${subject.image}" alt="${subject.name}" class="subject-image">`
                    : '';

                section.innerHTML = `
                    <h2>${subject.name}</h2>
                    ${imageHTML}
                    <div class="flashcard-container">
                        <div class="flashcard front"></div>
                        <div class="flashcard back"></div>
                    </div>
                    <div class="controls">
                        <button class="prevBtn">Previous</button>
                        <button class="flipBtn">Flip Card</button>
                        <button class="nextBtn">Next</button>
                    </div>
                    <div class="progress-bar"></div>
                `;

                subjectsContainer.appendChild(section);

                const flashcards = subject.cards;
                let currentIndex = 0;

                const flashcardContainer = section.querySelector(".flashcard-container");
                const frontCard = section.querySelector(".flashcard.front");
                const backCard = section.querySelector(".flashcard.back");
                const flipBtn = section.querySelector(".flipBtn");
                const nextBtn = section.querySelector(".nextBtn");
                const prevBtn = section.querySelector(".prevBtn");
                const progressBar = section.querySelector(".progress-bar");

                function updateCard() {
                    const card = flashcards[currentIndex];
                    frontCard.textContent = card.question;
                    backCard.textContent = card.answer;
                    updateProgressBar();
                }

                function updateProgressBar() {
                    progressBar.textContent = `Card ${currentIndex + 1} of ${flashcards.length}`;
                }

                updateCard();

                flipBtn.onclick = () => {
                    flashcardContainer.classList.toggle('flipped');
                };

                nextBtn.onclick = () => {
                    currentIndex = (currentIndex + 1) % flashcards.length;
                    flashcardContainer.classList.remove('flipped'); // Reset flip state
                    updateCard();
                };

                prevBtn.onclick = () => {
                    currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
                    flashcardContainer.classList.remove('flipped'); // Reset flip state
                    updateCard();
                };
            });
        })
        .catch(error => {
            console.error("Error loading study cards:", error);
            subjectsContainer.innerHTML = `<p style="color: red;">Error loading study cards. Please check the console for details.</p>`;
        });
});