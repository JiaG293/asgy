import moment from "moment";

export const convertISOToDDMMYYYY = (isoDateString) => {
  const date = new Date(isoDateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${day}-${month}-${year}`;
};

export const convertISOToHoursAndMinute = (isoDateString) => {
  const date = new Date(isoDateString);
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  return `${hour}:${minute}`;
};

export const convertISOToFullDateTime = (isoDateString) => {
  const date = new Date(isoDateString);
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return `${hour}:${minute} ${day}-${month}-${year}`;
};

export const calculateTimeAgo = (dateString) => {
    const currentDate = moment();
    const givenDate = moment(dateString);
  
    const diffYears = currentDate.diff(givenDate, "years");
    const diffMonths = currentDate.diff(givenDate, "months");
    const diffDays = currentDate.diff(givenDate, "days");
    const diffHours = currentDate.diff(givenDate, "hours");
    const diffMinutes = currentDate.diff(givenDate, "minutes");
  
    if (diffYears > 0) {
      return `${diffYears} năm trước`;
    } else if (diffMonths > 0) {
      return `${diffMonths} tháng trước`;
    } else if (diffDays > 0) {
      return `${diffDays} ngày trước`;
    } else if (diffHours > 0) {
      return `${diffHours} giờ trước`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} phút trước`;
    } else {
      return "Vừa mới";
    }
  };
  
