//
$(document).ready(function () {

    // click on form button
    $('#btn-add-cash').on('click', function () {
        let numRegex = '/^\d+$/;'
        let alphRegex = /^[A-Za-z]+$/

        const cardName = $('#card-name').val()
        const cardNumber = $('#card-number').val()
        const cardType = $('#card-type').val()
        const expiryMonth = $('#card-month').val()
        const expiryYear = $('#card-year').val()
        const cvv = $('#card-cvv').val()

        if (cardName.length > 0 && cardNumber.length > 0 && expiryMonth.length > 0 && expiryYear.length > 0 && cvv.length > 0
            && cardType.length > 0) {

            if (cardNumber.length == 16) {
                if ((expiryMonth >= 1 && expiryMonth <= 12) && (expiryYear >= 2017 && expiryYear <= 2051)) {
                    if ((expiryYear == 2017 && expiryMonth > 4) || (expiryYear > 2017)) {
                        if ((cvv >= 1 && cvv <= 9999) && (cvv.length >= 3 && cvv.length <= 4)) {
                            $('#form-payment-detail').submit()
                        } else {
                            $('#success-add-cash').addClass('hidden')
                            $('#error-add-cash').removeClass('hidden')
                            $('#error-add-cash-message').html('Неправильный CVV')
                        }
                    } else {
                        $('#success-add-cash').addClass('hidden')
                        $('#error-add-cash').removeClass('hidden')
                        $('#error-add-cash-message').html('Срок действия карты истек')
                    }
                } else {
                    $('#success-add-cash').addClass('hidden')
                    $('#error-add-cash').removeClass('hidden')
                    $('#error-add-cash-message').html('Неправильный срок истечения')
                }
            } else {
                $('#success-add-cash').addClass('hidden')
                $('#error-add-cash').removeClass('hidden')
                $('#error-add-cash-message').html('Неправильный номер карты')
            }
        } else {
            $('#success-add-cash').addClass('hidden')
            $('#error-add-cash').removeClass('hidden')
            $('#error-add-cash-message').html('Поля не заполнены')
        }

        setTimeout(() => {
            $('#error-add-cash').addClass('hidden')
            $('#success-add-cash').addClass('hidden')
        }, 6000)
    })

    // click on add card form button
    $('#btn-error-close').on('click', function () {
        $('#error-add-cash').addClass('hidden')
    })
})
