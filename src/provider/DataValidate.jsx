export default function DataValidate(data, type) {
  const errors = {};

  if (type === "changeNickName") {
    if (!data.nickName.trim()) {
      errors.nickName = "별명을 입력해주세요.";
    } else if (data.nickName.length < 5) {
      errors.nickName = "별명은 5글자 이상이어야 합니다.";
    } else if (data.nickName.length > 20) {
      errors.nickName = "별명은 20글자 이하이어야 합니다.";
    } else {
      delete errors.nickName;
    }
  }

  if (type === "jobPost" || type === "recPost") {
    if (!data.title.trim()) {
      errors.title = "제목을 입력해주세요.";
    } else if (data.title.length < 5) {
      errors.title = "제목은 5글자 이상이어야 합니다.";
    } else if (data.title.length > 50) {
      errors.title = "제목은 50글자 이하이어야 합니다.";
    } else {
      delete errors.title;
    }
    
    if (!data.contact.trim()) {
      errors.contact = "연락처를 입력해주세요.";
    } else {
      delete errors.contact;
    }
    
    if (!data.content.trim()) {
      errors.content = "본문 내용을 입력해주세요.";
    } else if (data.content.length < 10) {
      errors.content = "본문은 10글자 이상이어야 합니다.";
    } else if (data.content.length > 2000) {
      errors.content = "본문은 2000글자 이하이어야 합니다.";
    } else {
      delete errors.content;
    }
  }
  if (type === "recPost") {
    if (!data.companyName.trim()) {
      errors.companyName = "연락처를 입력해주세요.";
    } else {
      delete errors.companyName;
    }
  }

  if (type === "communityPost") {
    if (!data.title.trim()) {
      errors.title = "제목을 입력해주세요.";
    } else if (data.title.length < 5) {
      errors.title = "제목은 5글자 이상이어야 합니다.";
    } else if (data.title.length > 50) {
      errors.title = "제목은 50글자 이하이어야 합니다.";
    } else {
      delete errors.title;
    }
    
    if (!data.content.trim()) {
      errors.content = "본문 내용을 입력해주세요.";
    } else if (data.content.length < 10) {
      errors.content = "본문은 10글자 이상이어야 합니다.";
    } else if (data.content.length > 2000) {
      errors.content = "본문은 2000글자 이하이어야 합니다.";
    } else {
      delete errors.content;
    }
  }

  if (type === "comment") {
    if (!data.comment.trim()) {
      errors.comment = "댓글을 입력해주세요.";
    } else if (data.comment.length < 5) {
      errors.comment = "댓글은 5글자 이상이어야 합니다.";
    } else if (data.comment.length > 200) {
      errors.comment = "댓글은 200글자 이하이어야 합니다.";
    } else {
      delete errors.comment;
    }
  }

  return errors;
}