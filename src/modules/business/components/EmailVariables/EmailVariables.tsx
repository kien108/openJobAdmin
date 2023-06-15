import React, { FC, useEffect, useState } from "react";

import { Tag2, Tooltip } from "../../../../libs/components";

import { Label, StyledEmailVariables, StyledErrorMessage, StyledVariablesContent } from "./styles";

import { QuillEditor } from "../QuillEditor";
import { Quill } from "react-quill";

// import { useGetTempVariablesQuery } from '../../services/AccountApp';
import { useTranslation } from "react-i18next";

import { ITempVariable } from "../../types";

import { Controller, useFormContext } from "react-hook-form";
import { variables } from "../../data";

interface IEmailVariables {
   name: string;
   label?: string;
   required?: boolean;
   toolbar?: boolean;
   data?: string;
   delta?: string;
   editorRef: any;
   message?: string | undefined;
}

const BlockEmbed = Quill.import("blots/embed");

const EmailVariables: FC<IEmailVariables> = (props) => {
   const { label, name, required, toolbar, data, delta, editorRef } = props;

   const {
      control,
      register,
      setValue,
      formState: { errors },
   } = useFormContext();

   const errorMessage: any =
      (props.message && props.message) ||
      (errors && props.name ? errors[props.name]?.["message"] : "");

   const { t } = useTranslation();
   const [content, setContent] = useState("");

   const [curIndex, setCurIndex] = useState("");

   // const { data: variables } = useGetTempVariablesQuery();

   const createElementVariable = (name: string, marker: string, format = false) => {
      class Variable extends BlockEmbed {
         static create(value: any) {
            const node = super.create(typeof value === "object" ? value.text : value);
            node.innerText = typeof value === "object" ? value.text : value;
            node.setAttribute("contenteditable", true);
            return node;
         }

         static value(node: any) {
            const spanElement = node.querySelector("span");
            return {
               name: spanElement.innerText,
               marker: "[[" + spanElement.innerText + "]]",
               text: spanElement.innerText,
            };
         }
      }

      Variable["blotName"] = "TemplateVariable";
      Variable["className"] = "marker";
      Variable["tagName"] = "span";

      Quill.register("formats/TemplateVariable", Variable);

      let result = "";

      if (format) {
         const div = document.createElement("div");
         const quill = new Quill(div) as any;

         quill.insertEmbed(0, "TemplateVariable", name, "user");

         result = quill.root.querySelector("p").innerHTML;
      } else {
         const quill = editorRef.current.getEditor();
         quill.insertEmbed(curIndex, "TemplateVariable", name, "user");

         result = quill.root.innerHTML;
      }

      return result;
   };

   const formatVariables = (data: string, delta: string) => {
      const markers = JSON.parse(delta).ops.filter(
         (item: any) => item.insert?.TemplateVariable?.marker
      );

      let formattedData = data;
      console.log(data);

      markers.forEach((item: any) => {
         const { name, marker } = item.insert.TemplateVariable;

         console.log({ name, marker });

         formattedData = formattedData.replace(marker, createElementVariable(name, marker, true));
      });

      return formattedData;
   };

   const handleChooseVariable = (variable: ITempVariable) => {
      const newElement = createElementVariable(variable.name, variable.marker);

      setContent(newElement);
   };

   useEffect(() => {
      if (!data || !delta) return;

      const formattedData = formatVariables(data, delta);

      setContent(formattedData);
      setValue(name, formattedData);
   }, [data, delta]);

   useEffect(() => {
      const quill = editorRef.current.getEditor();

      quill.on("selection-change", function (delta: any, oldDelta: any, source: any) {
         if (!delta) return;

         setCurIndex(delta.index);
      });

      quill.on("text-change", function (delta: any, oldDelta: any, source: any) {
         setCurIndex(() => (delta.ops[0]?.retain ? delta.ops[0]?.retain + 1 : 1));
      });
   }, []);

   return (
      <StyledEmailVariables>
         {label && (
            <Label>
               {label}
               {required ? <span className="required-mark">*</span> : null}
            </Label>
         )}

         <StyledVariablesContent>
            <Label>Variables:</Label>
            <div className="content">
               {variables &&
                  variables.length > 0 &&
                  variables.map((variable) => (
                     <Tooltip
                        title={t(`${variable.description}`)}
                        placement="bottomRight"
                        key={variable.id}
                     >
                        <Tag2 onClick={() => handleChooseVariable(variable)}>{variable.name}</Tag2>
                     </Tooltip>
                  ))}
            </div>
         </StyledVariablesContent>
         <Controller
            name={name}
            control={control}
            render={({ field: { onChange, ...field } }) => (
               <QuillEditor
                  {...field}
                  {...register(`${name}`)}
                  editorRef={editorRef}
                  value={content}
                  onChange={(content) => {
                     onChange(content);
                     setContent(content);
                  }}
                  toolbar={toolbar}
               />
            )}
         />
         {errorMessage && <StyledErrorMessage>{errorMessage}</StyledErrorMessage>}
      </StyledEmailVariables>
   );
};

export default EmailVariables;
