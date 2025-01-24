const router = require('express').Router()
const data = require('../controller')

router.get('/get-room-at-floor/:floorId', data.data.getRoomBaseSelect)
router.get('/get-shift-room/:roomId', data.data.getAllShift)


router.get('/get-all-reservation', data.data.getAllBookingReservation)
router.get('/get-one-reservation/:reservationTransactionId', data.data.getOneReservationDetailPage)
router.get('/get-detail-component-data/:reservationTransactionId', data.data.getDetailComponentReservation)
router.get('/filter-data-by-date', data.data.getDataBasedOnFilterDate)


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
router.patch('/spv-update-isavail/:reservationTransactionId', data.data.updateRoomIsAvailDecline)

// validation
router.post('/validate-form-borrower', data.data.validationBorrower)
router.post('/validation-form-event-room-data', data.data.validationRoomEventData)
router.post('/validation-form-inventory-request', data.data.validationInventoryRequest)

// get facility id
router.get('/get-facilities', data.data.getAllFacility)

/**
 * insert data borrowing v2
 */

router.post(`/insert-data-borrowing`, data.data.insertDataBorrowing)

module.exports = router