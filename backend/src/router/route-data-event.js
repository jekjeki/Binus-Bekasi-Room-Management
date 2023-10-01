const router = require('express').Router()
const data = require('../controller')
const { ratIdValidation } = require('../validations/validation')

router.get('/get-all-floor', data.data.getFloor)
router.get('/get-room-at-floor/:floorId', data.data.getAllRoom)
router.get('/get-shift-room/:roomId', data.data.getAllShift)

router.get('/get-all-reservation', data.data.getAllBookingReservation)
router.get('/get-one-reservation/:reservationTransactionId', data.data.getOneReservationDetailPage)
router.get('/get-detail-component-data/:reservationTransactionId', data.data.getDetailComponentReservation)
router.get('/filter-data-by-date/:date', data.data.getDataBasedOnFilterDate)
router.get('/get-room-available-transaction/:floorId/:roomId/:shiftId', data.data.getRoomAvailableTransaction)


router.post('/insert-data-reservation',ratIdValidation , data.data.insertDataReservation)
router.post('/insert-data-borrower', data.data.insertDataBorrower)
router.post('/insert-event-data', data.data.insertEventData)

router.delete('/delete-specific-data/:reservationTransactionId', data.data.deleteSpecificData)

// update modal 
router.patch('/update-reservation-data/:reservationTransactionId', data.data.updateSpecificData)
router.patch('/manager-update-reservation-status/:rtId', data.data.updateReservationStatusData)
router.get('/get-rat-id/:floorId/:roomId/:shiftId', data.data.getRatIdForUpdate)

module.exports = router