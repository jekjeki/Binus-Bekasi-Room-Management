const router = require('express').Router()
const data = require('../controller')
const { ratIdValidation } = require('../validations/validation')

router.get('/get-all-floor', data.data.getFloor)
router.get('/get-room-at-floor', data.data.getAllRoom)
router.get('/get-shift-room', data.data.getAllShift)

router.get('/get-all-reservation', data.data.getAllBookingReservation)
router.get('/get-one-reservation/:reservationTransactionId', data.data.getOneReservationDetailPage)
router.get('/get-detail-component-data/:reservationTransactionId', data.data.getDetailComponentReservation)
router.get('/filter-data-by-date/:date', data.data.getDataBasedOnFilterDate)
// router.get('/get-room-available-transaction', data.data.getRoomAvailableTransaction)
router.get('/get-all-room-available', data.data.getRoomIsAvail);

router.get('/get-all-room-isAvail', data.data.getAllRoomIsAvail)

router.post('/insert-data-reservation' , data.data.insertDataReservation)
router.post('/insert-data-borrower', data.data.insertDataBorrower)
router.post('/insert-event-data', data.data.insertEventData)

router.delete('/delete-specific-data/:reservationTransactionId', data.data.deleteSpecificData)
router.patch('/update-room-available/:roomId', data.data.updateRoomAvailableData)

// update modal 
router.patch('/update-reservation-data/:reservationTransactionId', data.data.updateSpecificData)
router.patch('/manager-update-reservation-status/:rtId', data.data.updateReservationStatusData)
router.get('/get-rat-id/:floorId/:roomId/:shiftId', data.data.getRatIdForUpdate)

router.patch('/rat-update-status/:ratId', data.data.updateStatusRatData)
router.patch('/update-room-isavail/:roomAvailableId', data.data.updateRoomIsAvail)


// spv
router.patch('/spv-update-status-room/:reservationTransactionId', data.data.SPVUpdateStatusRat)


module.exports = router