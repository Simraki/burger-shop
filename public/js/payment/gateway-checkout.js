$(document).ready(function () {

    // click on saved card form button
    $('#btn-saved-card').on('click', function () {

        const card = $('input[name="savedCard"]:checked').val()
        const form = $('#form-saved-card')

        if (card === undefined) {
            alert('Выберите карту')
        } else {
            form.submit()
        }
    })

    // click on new card form button
    $('#btn-new-card').on('click', function () {
        let numRegex = '/^\d+$/'
        let alphRegex = /^[A-Za-z]+$/

        const cardName = $('#new-card-name').val()
        const cardNumber = $('#new-card-number').val()
        const cardType = $('#new-card-type').val()
        const expiryMonth = $('#new-card-month').val()
        const expiryYear = $('#new-card-year').val()
        const cvv = $('#new-card-cvv').val()
        const form = $('#form-new-card')

        if (cardName.length > 0 && cardNumber.length > 0 && expiryMonth.length > 0 && expiryYear.length > 0 && cvv.length > 0
            && cardType.length > 0) {

            if (cardNumber.length == 16) {
                if ((expiryMonth >= 1 && expiryMonth <= 12) && (expiryYear >= 2017 && expiryYear <= 2051)) {
                    if ((expiryYear == 2017 && expiryMonth > 4) || (expiryYear > 2017)) {
                        if ((cvv >= 1 && cvv <= 9999) && (cvv.length >= 3 && cvv.length <= 4)) {

                            form.submit()

                        } else {
                            $('#error-new-card').removeClass('hidden')
                            $('#error-new-card-message').html('Неправильный CVV')
                        }
                    } else {
                        $('#success-new-card').addClass('hidden')
                        $('#error-new-card').removeClass('hidden')
                        $('#error-new-card-message').html('Срок действия карты истек')
                    }
                } else {
                    $('#error-new-card').removeClass('hidden')
                    $('#error-new-card-message').html('Неправильный срок истечения')
                }
            } else {
                $('#error-new-card').removeClass('hidden')
                $('#error-new-card-message').html('Неправильный номер карты')
            }
        } else {
            $('#error-new-card').removeClass('hidden')
            $('#error-new-card-message').html('Поля не заполнены')
        }

        setTimeout(() => {
            $('#error-new-card').addClass('hidden')
        }, 6000)
    })
})

function addCash() {
    window.location.href = '/user/dashboard/wallet'
}
