export const Event = (type, aggregateId, payload) => ({
    type,
    aggregateId: aggregateId,
    payload
});
