import { ApexAnnotations, ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexPlotOptions, ApexStroke, ApexTitleSubtitle, ApexXAxis } from "ng-apexcharts";

export interface SubjectMasterClass {
    boardId:string,
    mediumId: string,
    classId: string,
    name: string,
    thumbnail: any,
    id?: any,
    code: any;
}

export interface BookMasterClass {
    name: string,
    boardId: string,
    mediumId: string,
    classId: string,
    subjectId: string,
    id?: any,
    thumbnail: string
}

export interface ChapterMasterClass {
    boardId: string;
    mediumId: string;
    classId: string;
    subjectId: string;
    bookId: string;
    chapterName: string;
    thumbnail: string;
    order: any;
    id?: any;
  
    // New additions
    ebookIcon?: string;
    ebookPoster?: string;
    ebookDescription?: string;
  
    quickRecapIcon?: string;
    quickRecapPoster?: string;
    quickRecapDescription?: string;
  
    bookQuestionSolutionsIcon?: string;
    bookQuestionSolutionsPoster?: string;
    bookQuestionSolutionsDescription?: string;
  
    chapterEvaluationIcon?: string;
    chapterEvaluationPoster?: string;
    chapterEvaluationDescription?: string;
  }
  

export interface ChapterArrayClass {
    chapterName: string,
    thumbnail: string,
}
export interface BoardMasterClass {
    name: string,
    id?: string,
}
export interface ClassMasterClass {
    className: string,
    order: number,
    id?: string
}
export interface MediumMasterClass {
    name: string,
    id?: string
}

export interface LoginClass {
    email: string,
    password: string
}

export interface LessonMasterClass {
    boardId: string,
    mediumId: string,
    classId: string,
    subjectId: string,
    bookId: string,
    chapterId: string,
    order: any,
    id?: any,
    name: string,
    type: string,
    thumbnail: string,
    poster: string,
    description: string

    // Video Lectures
    videoLecturesIcon?: any;
    videoLecturesPoster?: any;
    videoLecturesDescription?: string;

    // Multimedia Videos
    // multimediaVideosIcon?: any;
    // multimediaVideosPoster?: any;
    // multimediaVideosDescription?: string;

    // Self Evaluation
    selfEvaluationIcon?: any;
    selfEvaluationPoster?: any;
    selfEvaluationDescription?: string;

    // Practice Test
    practiceTestIcon?: any;
    practiceTestPoster?: any;
    practiceTestDescription?: string;

    // Case Study
    caseStudyIcon?: any;
    caseStudyPoster?: any;
    caseStudyDescription?: string;

    // Quick Recap
    quickRecapIcon?: any;
    quickRecapPoster?: any;
    quickRecapDescription?: string;

    // Question and Answer
    questionAndAnswersIcon?: any;
    questionAndAnswersPoster?: any;
    questionAndAnswersDescription?: string;
}

export interface MultimediaClass {
    boardId: string,
    mediumId: string,
    classId: string,
    subjectId: string,
    bookId: string,
    chapterId: string,
    lessonId: string,
    lessionName: string,
    icon1: string,
    icon2: string,
    path: string,
    order: string,
    multimediaType: string
    videoType: string,
    mobileVideoType: string,
    mobileVideoPath: string,
    description: string,
    id?: any;
}

export interface MultimediaArray {
    lessionName: string,
    icon1: string,
    icon2: string,
    path: string,
    order: string,
}

export interface eBookClass {
    boardId: string,
    mediumId: string,
    classId: string,
    subjectId: string,
    bookId: string,
    chapterId: string,
    chapterName: string,
    path: string,
    order: number,
    id?: number;
}
export interface quickRecapClass {
    boardId: string,
    mediumId: string,
    classId: string,
    subjectId: string,
    bookId: string,
    description: string,
    chapterId: string,
    lessonId?: string,
    chapterName?: string,
    id?: number;
}
export interface HomeworkClass {
    boardId: string;
    mediumId: string;
    classId: string;
    subjectId: string;
    bookId: string;
    chapterId: string;
    lessonId: string;
    Question: string;
    answer: string;
    answerType: 'Very Short Answer' | 'Short Answer' | 'Long Answer';
    questionLevel: number;
    id?: number;
  }
  
export interface QuizClass {
    boardId: string,
    mediumId: string,
    classId: string,
    subjectId: string,
    bookId: string,
    chapterId: string,
    lessonId: string,
    lectureVideoId: string,
    quizName: string,
    options: { A: any; B: any; C: any; D: any }[];
    correctOptions: string[],
    correctOptionsTF: string,
    explain: string,
    hint: string,
    id?: string,
    types: string,
    displayFormat: number,         // New -  1 series and 2 cube 
    questionLevel: number,          // New - Easy = 1, Medium = 2, Hard = 3, Normal = 4
    questionType: number,           // New - MCQ = 1, True/False = 2
    weightage: number,              // New - Weightage of the question
    negativeWeightage: number       // New - Negative weightage for wrong answer
}

export interface caseStudiesClass {
    case: string; // The case study text
    questions: {
      question: string; // The question text
      answer: string;   // The answer text
    }[];
    boardId: string; 
    mediumId: string; 
    classId: string; 
    bookId: string; 
    subjectId: string; 
    chapterId: string; 
    lessonId: string; 
}

export interface ChartOptions {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    fill: ApexFill;
    colors: String[];
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    xaxis: ApexXAxis;
};

export interface StudentSession{
    sessionId:string,
    studentId: string,
    classId: string,
    sectionId: string; 
}
export interface Quiz_Question{
    questionId:string,
    // userId: string,
    selectedOptions:number [];
}
export interface RolesMasterClass {
    role: string,
    id?: string
}

// export interface LoginClass {
//     schoolName: string,
//     password: string ,
//     mobNumber:number,
//     id?: string
// }

export interface AttendanceDetails {
    totalStudents: number,
    presentStudents: number,
    absentStudents: number,
    halfdayStudents: number
}