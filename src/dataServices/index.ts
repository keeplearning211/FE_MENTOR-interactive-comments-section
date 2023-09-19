import { CommentSection } from './../type';
import data from '../data';
import { parseCommentSection } from '../utils';

export const COMMENT_SECTION_DATA = 'COMMENT_SECTION_DATA';

const getCommentSection = (): CommentSection => {
  try {
    // Check if the comment section data exists in localStorage
    const localStorageData = localStorage.getItem(COMMENT_SECTION_DATA);
    if (localStorageData) {
      // Try to parse the comment section data
      const commentSectionData = tryParseLocalStorageData(localStorageData);
      if (commentSectionData) {
        return parseCommentSection(commentSectionData);
      }
    }

    // If the comment section data does not exist in localStorage,
    // set it to the initial data and return the initial data
    localStorage.setItem(COMMENT_SECTION_DATA, JSON.stringify(data));
    return parseCommentSection(data);
  } catch (err) {
    console.log('🚀 ~ file: index.ts:24 ~ getCommentSection ~ err:', err)

    localStorage.setItem(COMMENT_SECTION_DATA, JSON.stringify(data));
    return parseCommentSection(data);
  }
};

function tryParseLocalStorageData(localStorageData: string): object | null {
  try {
    return JSON.parse(localStorageData);
  } catch (error) {
    console.log(error);
    return null
  }
}

const dataServices = {
  getCommentSection
}

export default dataServices

