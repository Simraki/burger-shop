//
$(document).ready(function () {

    // click on user wallet form button
    $('#btn-user-quick-add').on('click', function () {

        const regex = /^[A-Za-z]+$/
        const amtRegex = /^-?\d+(\.\d{1,2})?$/
        const amount = $('#amount').val()
        const card = $('#pay-card').val()
        const form = $('#form-user-wallet')

        if (amount.length > 0 && amount !== 0 && card != null) {
            if (!regex.test(amount) && amtRegex.test(amount)) {
                const formData = {
                    amount: amount,
                    description: amount > 0 ? 'Пополнение' : 'Снятие',
                    cardUsed: card,
                }

                $.ajax({
                    url: '/user/update/wallet',
                    type: 'PUT',
                    dataType: 'json',
                    data: JSON.stringify(formData),
                    success: function (data) {
                        if (data.success == false) {
                            console.log(data)
                            $('#success-wallet').addClass('hidden')
                            $('#error-wallet').removeClass('hidden')
                            $('#amount').val('')
                            $('#error-wallet-message').html(data.error ?? 'Ошибка')
                        } else {
                            $('#error-wallet').addClass('hidden')
                            $('#success-wallet').removeClass('hidden')
                            $('#wallet-amount').html(data.amount + ' ₽')
                            $('#wallet-transaction-panel').load(location.href + ' #wallet-transaction-panel')
                            $('#amount').val('')
                            // $('#pay-card').val('Выберите')
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        alert(thrownError)
                    },
                    contentType: 'application/json',
                })
            } else {
                $('#success-wallet').addClass('hidden')
                $('#error-wallet').removeClass('hidden')
                $('#amount').val('')
                $('#error-wallet-message').html('Неправильная сумма')
            }
        } else {
            $('#success-wallet').addClass('hidden')
            $('#error-wallet').removeClass('hidden')
            $('#error-wallet-message').html('Поля не заполнены')
        }

        setTimeout(() => {
            $('#error-wallet').addClass('hidden')
            $('#success-wallet').addClass('hidden')
        }, 3000)
    })

    // on selecting dropdown
    $('#pay-card').on('change', function () {
        let addCard = $('#pay-card option:selected').val()

        if (addCard === 'redirect') {
            location = '/user/dashboard/payments#add-card-head'
        }

    })

    // click on user login form button
    $('#btn-error-close').on('click', function () {
        $('#error-wallet').addClass('hidden')
    })
})
