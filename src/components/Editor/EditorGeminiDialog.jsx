import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useMemo, useState } from "react";
import classes from "./Editor.module.css";

export default function EditorGeminiDialog({ editor, open, onClose }) {
  const [isGeminiRunning, setIsGeminiRunning] = useState(false);
  const model = useMemo(() => {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API);
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const content = editor.getHTML();
    const userPrompt = e.target.elements.userPrompt.value;
    const defaultPromptOne =
      " : 앞서 제공된 HTML 형식의 본문 내용을 뒤이어 입력될 사용자의 요청에 맞게 개선해주세요 : ";
    const defaultPromptTwo =
      " : 출력값은 반드시 아래 사항들을 반드시 준수해야 합니다. \
      1. 만약 사용자가 입력한 요청이 충분하지 않더라도 반드시 결과값은 제공된 본문을 바탕으로 개선된 내용을 담고 있을 것 \
      2. 결과값을 표현하는데 Header, List, Ul, Ol을 활용할 수 있다. 다만 마크다운 문법이 아닌 HTML 태그를 활용할 것. \
      3. 본문 내용을 표현하는데 불필요한 태그 및 Boilerplate 코드는 담지 말 것.";

    setIsGeminiRunning(true);
    model
      .generateContent(content + defaultPromptOne + userPrompt + defaultPromptTwo)
      .then((result) => {
        const generatedContent = result.response.text().trim();
        if (generatedContent.startsWith("```html") && generatedContent.endsWith("```")) {
          const contentWithoutBlock = generatedContent.slice(7, -3);
          editor.commands.setContent(contentWithoutBlock, true);
        } else {
          editor.commands.setContent(generatedContent, true);
        }
        setIsGeminiRunning(false);
        onClose();
      });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
      className={isGeminiRunning ? classes.geminiDialogLoading : classes.geminiDialog}
    >
      <DialogTitle>Gemini AI</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Gemini AI로 본문을 어떻게 개선하고 싶으신가요?
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="userPrompt"
          label="본문을 어떻게 개선하고 싶으신가요?"
          type="text"
          fullWidth
          multiline
          disabled={isGeminiRunning}
          sx={{ marginTop: "1.3rem" }}
        />
      </DialogContent>
      <DialogActions sx={{ padding: "0 1rem 1rem 1rem" }}>
        <Button onClick={onClose} disabled={isGeminiRunning}>취소</Button>
        <Button type="submit" variant="contained" disabled={isGeminiRunning}>
          {isGeminiRunning ? "처리 중..." : "확인"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
