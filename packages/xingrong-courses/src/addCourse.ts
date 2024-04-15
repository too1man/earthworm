import { db } from "@earthworm/db";
import { course as courseSchema, statement } from "@earthworm/schema";
import fs from "fs";
import path from "path";

// (async function () {
//   createScheme(53);
//   console.log("全部创建完成");
//   process.exit(0);
// })();

async function createScheme(num: number) {
  const max =
    (await db.select().from(statement).orderBy(statement.order)).length + 1;
  const [response] = await db.insert(courseSchema).values({
    id: num,
    title: convertToChineseNumber(num + ""),
  });

  const course = `${num}.json`;

  const courseDataText = fs.readFileSync(
    path.resolve(__dirname, `../data/courses/${course}`),
    "utf-8"
  );

  const courseData = JSON.parse(courseDataText);

  let orderIndex = max;
  let cId = max;
  const promiseAll = courseData.map((statement: any, index: number) => {
    const { chinese, english, soundmark } = statement;

    const result = createStatement(
      orderIndex,
      chinese,
      english,
      soundmark,
      cId
    );
    orderIndex++;
    return result;
  });

  console.log(`开始上传： courseName:${course}`);
  await Promise.all(promiseAll);
  console.log(`courseName: ${course} 全部上传成功`);
}

function createStatement(
  order: number,
  chinese: string,
  english: string,
  soundmark: string,
  courseId: number
) {
  return db.insert(statement).values({
    order,
    chinese,
    english,
    soundmark,
    courseId,
  });
}

function convertToChineseNumber(numStr: string): string {
  const chineseNumbers = [
    "零",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
    "十",
  ];
  let chineseStr = "第";
  if (parseInt(numStr) >= 10) {
    const [tens, ones] = numStr.split("");
    if (tens !== "1") {
      chineseStr += chineseNumbers[parseInt(tens, 10)];
    }
    chineseStr += "十";
    if (ones !== "0") {
      chineseStr += chineseNumbers[parseInt(ones, 10)];
    }
  } else {
    chineseStr += chineseNumbers[parseInt(numStr, 10)];
  }
  chineseStr += "课";
  return chineseStr;
}
