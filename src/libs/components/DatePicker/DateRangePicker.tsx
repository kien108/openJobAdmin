import { RangePickerProps } from "antd/lib/date-picker";
import moment from "moment";
import { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MinimizeIcon } from "../Icons";
import { ContainerRangePicker, Label, StyledRangePicker } from "./style";
import "./style.scss";

interface IRangePicker {
   label?: string;
   format: string;
   onChange?: (date: any, dateString: any) => void;
   errors?: string;
}

const DateRangePicker: FC<IRangePicker & RangePickerProps> = ({
   label,
   format,
   onChange,
   errors,
   ...props
}) => {
   const { t } = useTranslation();
   const mask = String(format).includes(".") ? "." : "/";

   const [isFocus, setIsFocus] = useState(false);
   const [value, setValue] = useState<any>(props.defaultValue || props.value);

   const refDate = useRef<any>(null);
   const indexOfSlash = useRef<number[]>([]);
   const arrDate = useRef<string[]>([]);

   useEffect(() => {
      setValue(props.value);
   }, [props.value]);

   const dateInputMask = (elInput) => {
      indexOfSlash.current = [];
      arrDate.current = [];
      if (format) {
         for (let i = 0; i < format.length; i++) {
            if (format[i] === mask && indexOfSlash.current.length < 2) {
               indexOfSlash.current.push(i);
            }
         }

         arrDate.current = format.split(mask);
      }

      elInput?.forEach((elm, idx) => {
         if (elm) {
            elm.maxLength = 10;

            elm.addEventListener("keydown", (e) => {
               const len = elm.value.length;
               if (e.keyCode !== 8) {
                  if ((e.keyCode < 47 || e.keyCode > 57) && (e.keyCode > 105 || e.keyCode < 95)) {
                     e.preventDefault();
                  }

                  if (e.shiftKey) {
                     e.preventDefault();
                  }

                  if (len !== 1 || len !== 3) {
                     if (e.keyCode == 47) {
                        e.preventDefault();
                     }
                  }

                  for (let i = 0; i < indexOfSlash.current.length; i++) {
                     if (len === indexOfSlash.current[i]) {
                        elm.value += mask;
                     }
                  }

                  if (!moment(elm.value, arrDate.current.join(mask)).isValid() && len === 9) {
                     const date = elm.value.split(mask);

                     const idxY = arrDate.current.indexOf("YYYY");
                     const idxM = arrDate.current.indexOf("MM");
                     const idxD = arrDate.current.indexOf("DD");

                     if (Number(date[idxM]) === 0 || Number(date[idxM]) > 12) date[idxM] = 12;
                     date[idxD] = new Date(date[idxY], date[idxM] + 1, 0).getDate();

                     const temp = date.join(mask);

                     elm.value = temp.substring(0, elm.value?.length - 1) + temp?.at(-1);
                  }
                  //
                  else if (idx === 1 && elInput[0].value > elm.value && len === 9) {
                     elm.value = elInput[0].value.substring(0, elInput[0].value?.length - 1);
                  }
               }
            });

            elm.addEventListener("keyup", (e) => {
               const len = elm.value.length;
               if ((e.keyCode < 47 || e.keyCode > 57) && (e.keyCode > 105 || e.keyCode < 95)) {
                  e.preventDefault();
               }

               if (idx === 1 && elInput[0].value > elm.value && len === 10) {
                  elm.value = elInput[0].value.substring(0, elInput[0].value?.length - 1);
               }
               //
               else if (len === 10) {
                  elm.blur();
               }
            });
         }
      });
   };
   const elInput = refDate.current?.querySelectorAll(".ant-picker-input input");
   const btnClear = refDate.current?.querySelectorAll(".ant-picker-clear")[0];

   useEffect(() => {
      dateInputMask(elInput);
      btnClear?.addEventListener("mousedown", () => {
         elInput[0].focus();
      });
   }, [elInput, btnClear, format, mask]);

   return (
      <ContainerRangePicker ref={refDate}>
         <StyledRangePicker
            isFocus={value || isFocus}
            placeholder={
               isFocus
                  ? props.placeholder
                     ? props.placeholder
                     : [format.toLowerCase()!, format.toLowerCase()!]
                  : ["", ""]
            }
            dropdownClassName="style-range-picker-popover"
            className="style-date"
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            separator={<MinimizeIcon width={16} height={16} />}
            onChange={(dates: any, dateStrings: any) => {
               setValue(dates);
               onChange?.(dates, dateStrings);
            }}
            format={format}
            {...props}
         />
         <Label isFocus={value || isFocus}>{label ? label : t("dateRange")}</Label>
      </ContainerRangePicker>
   );
};

export default DateRangePicker;
