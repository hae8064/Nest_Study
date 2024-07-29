import { join } from 'path';

export const PROJECT_ROOT_PATH = process.cwd();

// 외부에서 접근 가능한 파일 모아둔 폴더 이름
export const PUBLIC_FOLDER_NAME = 'public';

// 퍼블릭 폴더 안에 post관련 폴더
export const POSTS_FOLDER_NAME = 'posts';

// 임시 폴더 이름
export const TEMP_FOLDER_NAME = 'temp';

// 실제 공개 폴더의 절대경로
// join은 ,콤마로 나눈걸 슬래시로 추가해서 경로 만들어줌
export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME);

// 포스트 이미지를 저장할 폴더
export const POST_IMAGE_PATH = join(PUBLIC_FOLDER_PATH, POSTS_FOLDER_NAME);

export const POST_PUBLIC_IMAGE_PATH = join(
  PUBLIC_FOLDER_NAME,
  POSTS_FOLDER_NAME,
);

// 임시 파일을 저장할 폴더
// [프로젝트 겨올]/temp
export const TEMP_FOLDER_PATH = join(PUBLIC_FOLDER_PATH, TEMP_FOLDER_NAME);
