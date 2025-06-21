import Swal from "sweetalert2";

export class AlertService {
    static error(title: string, text: string) {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: text,
            confirmButtonText: 'I understand!',
            customClass: {
                popup: 'card',
                confirmButton: 'btn btn-primary',
                denyButton: 'btn btn-secondary',
                cancelButton: 'btn btn-primary'
            }
        })
    }

    static info(text: string) {
        return Swal.fire({
            icon: 'info',
            text: text,
            confirmButtonText: 'I understand!',
            customClass: {
                popup: 'card',
                confirmButton: 'btn btn-primary',
                denyButton: 'btn btn-secondary',
                cancelButton: 'btn btn-primary'
            }
        })
    }

    static question(title: string, text: string) {
        return Swal.fire({
            icon: 'question',
            title: title,
            text: text,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes, please',
            cancelButtonText: "No, I don't",
            customClass: {
                popup: 'card',
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            }
        })
    }
    // Add this method to your alert.service.ts
    static reviewForm(petName: string): Promise<any> {
        let selectedRating = 5; // Default rating

        return Swal.fire({
            title: `Review ${petName}`,
            html: `
            <div class="mb-3">
                <label class="form-label">Rating</label>
                <div id="ratingStars" class="rating-stars">
                    ${[1, 2, 3, 4, 5].map(star => `
                        <i class="fa-solid fa-star ${star <= 5 ? 'text-warning' : 'text-muted'}" 
                           data-rating="${star}" 
                           style="cursor: pointer; font-size: 2rem; margin-right: 0.5rem;"></i>
                    `).join('')}
                </div>
                <input type="hidden" id="swal-rating" value="5">
            </div>
            <div class="mb-3">
                <label for="swal-comment" class="form-label">Comment</label>
                <textarea id="swal-comment" class="form-control" rows="3" required></textarea>
            </div>
        `,
            showCancelButton: true,
            confirmButtonText: 'Submit Review',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'card',
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-secondary'
            },
            preConfirm: () => {
                const comment = (Swal.getPopup()?.querySelector('#swal-comment') as HTMLTextAreaElement)?.value;
                const ratingInput = (Swal.getPopup()?.querySelector('#swal-rating') as HTMLInputElement);
                const rating = ratingInput ? parseInt(ratingInput.value) : 0;

                if (!rating || !comment) {
                    Swal.showValidationMessage('Please provide both a rating and comment');
                    return false;
                }

                return { rating, comment };
            },
            didOpen: () => {
                const stars = Swal.getPopup()?.querySelectorAll('.fa-star');
                const ratingInput = Swal.getPopup()?.querySelector('#swal-rating') as HTMLInputElement;

                stars?.forEach(star => {
                    star.addEventListener('click', (event) => {
                        const target = event.currentTarget as HTMLElement;
                        const rating = target.getAttribute('data-rating');
                        selectedRating = rating ? parseInt(rating) : 0;

                        if (ratingInput) {
                            ratingInput.value = selectedRating.toString();
                        }

                        // Update star display
                        stars?.forEach((s) => {
                            const starRating = s.getAttribute('data-rating');
                            const starValue = starRating ? parseInt(starRating) : 0;
                            if (starValue <= selectedRating) {
                                s.classList.add('text-warning');
                                s.classList.remove('text-muted');
                            } else {
                                s.classList.remove('text-warning');
                                s.classList.add('text-muted');
                            }
                        });
                    });
                });
            }
        });
    }
}