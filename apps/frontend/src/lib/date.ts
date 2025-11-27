import moment from "moment";

export const isPast = (date: moment.MomentInput) => {
  return moment(date).isBefore(moment());
};