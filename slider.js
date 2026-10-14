
/* Uchit Joshi - CSE 230 Image Slider Assignment */

class ImageSlider {
    constructor(slider) {
        this.slider = slider;
        this.track = slider.querySelector(".slider-track");
        this.slides = Array.from(
            this.track.querySelectorAll(".slide")
        );

        this.previousButton = slider.querySelector(".previous");
        this.nextButton = slider.querySelector(".next");

        this.container = slider.parentElement;
        this.dotsContainer = this.container.querySelector(".slider-dots");
        this.counter = this.container.querySelector(".slide-counter");

        this.totalSlides = this.slides.length;
        this.currentIndex = 0;
        this.isAnimating = false;
        this.animationDuration = 550;

        this.cloneFirst = this.slides[0].cloneNode(true);
        this.cloneLast = this.slides[this.totalSlides - 1].cloneNode(true);

        this.cloneFirst.setAttribute("aria-hidden", "true");
        this.cloneLast.setAttribute("aria-hidden", "true");

        this.track.appendChild(this.cloneFirst);
        this.track.insertBefore(this.cloneLast, this.slides[0]);

        this.allSlides = Array.from(
            this.track.querySelectorAll(".slide")
        );

        this.position = 1;

        this.createDots();
        this.bindEvents();
        this.updateSlider(false);
    }

    createDots() {
        this.dotsContainer.innerHTML = "";

        this.slides.forEach((slide, index) => {
            const dot = document.createElement("button");

            dot.type = "button";
            dot.className = "slider-dot";
            dot.setAttribute("aria-label", `Go to image ${index + 1}`);
            dot.setAttribute("aria-current", "false");

            if (index === 0) {
                dot.classList.add("active");
                dot.setAttribute("aria-current", "true");
            }

            this.dotsContainer.appendChild(dot);
        });

        this.dots = Array.from(
            this.dotsContainer.querySelectorAll(".slider-dot")
        );
    }

    bindEvents() {
        this.nextButton.addEventListener("click", () => {
            this.goToNext();
        });

        this.previousButton.addEventListener("click", () => {
            this.goToPrevious();
        });

        this.dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                this.goToSlide(index);
            });
        });

        this.track.addEventListener("transitionend", (event) => {
            if (event.target !== this.track ||
                event.propertyName !== "transform") {
                return;
            }

            this.handleTransitionEnd();
        });

        this.slider.addEventListener("keydown", (event) => {
            if (event.key === "ArrowRight") {
                event.preventDefault();
                this.goToNext();
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                this.goToPrevious();
            }
        });

        window.addEventListener("resize", () => {
            this.updateSlider(false);
        });
    }

    goToNext() {
        if (this.isAnimating) return;

        this.isAnimating = true;
        this.position += 1;
        this.currentIndex =
            (this.currentIndex + 1) % this.totalSlides;

        this.updateSlider(true);
    }

    goToPrevious() {
        if (this.isAnimating) return;

        this.isAnimating = true;
        this.position -= 1;
        this.currentIndex =
            (this.currentIndex - 1 + this.totalSlides) %
            this.totalSlides;

        this.updateSlider(true);
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentIndex) {
            return;
        }

        this.isAnimating = true;

        this.currentIndex = index;
        this.position = index + 1;

        this.updateSlider(true);
    }

    updateSlider(animate = true) {
        this.track.style.transition = animate
            ? `transform ${this.animationDuration}ms ease-in-out`
            : "none";

        const slideWidth = this.slider.clientWidth;
        const offset = this.position * slideWidth;

        this.track.style.transform = `translateX(-${offset}px)`;

        this.updateControls();
    }

    updateControls() {
        this.dots.forEach((dot, index) => {
            const isActive = index === this.currentIndex;

            dot.classList.toggle("active", isActive);
            dot.setAttribute(
                "aria-current",
                isActive ? "true" : "false"
            );
        });

        this.counter.textContent =
            `Image ${this.currentIndex + 1} of ${this.totalSlides}`;

        this.slides.forEach((slide, index) => {
            slide.setAttribute(
                "aria-hidden",
                index === this.currentIndex ? "false" : "true"
            );
        });
    }

    handleTransitionEnd() {
        if (this.position === this.totalSlides + 1) {
            this.position = 1;
            this.updateSlider(false);
        } else if (this.position === 0) {
            this.position = this.totalSlides;
            this.updateSlider(false);
        }

        this.isAnimating = false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector(".slider-container");

    if (slider) {
        new ImageSlider(slider);
    }
});
