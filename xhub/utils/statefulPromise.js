export default function statefulPromise(promise) {
  if (promise.isResolved) return promise;

  let isFulfilled = false;
  let isRejected = false;
  let isPending = true;

  let finalPromise = promise.then(
    (data) => {
      isFulfilled = true;
      isPending = false;
      return data;
    },
    (error) => {
      isRejected = true;
      isPending = false;
      return error;
    }
  )

  finalPromise.isFulfilled = () => isFulfilled;
  finalPromise.isRejected = () => isRejected;
  finalPromise.isPending = () => isPending;

  return finalPromise;
}
