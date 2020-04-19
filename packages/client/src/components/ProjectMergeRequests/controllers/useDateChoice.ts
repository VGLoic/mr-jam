import { useState } from "react";
import { subDays, differenceInDays } from "date-fns";

export interface UseDateChoice {
  fromDate: Date | null;
  onChangeFrom: (date: Date | null) => void;
  toDate: Date;
  onChangeTo: (date: Date) => void;
  isFromDateValid: boolean;
}
export const useDateChoice = (): UseDateChoice => {
  const [fromDate, setFromDate] = useState<Date | null>(
    subDays(new Date(), 14)
  );
  const [toDate, setToDate] = useState<Date>(new Date());

  const isFromDateValid: boolean =
    fromDate === null || differenceInDays(toDate, fromDate) >= 0;

  return {
    fromDate,
    onChangeFrom: setFromDate,
    toDate,
    onChangeTo: setToDate,
    isFromDateValid,
  };
};
