// src/utils/sqlFormatter.js

export function formatSQL(sql) {
  // 去除多余的空格和换行
  sql = sql.replace(/\s+/g, ' ').trim();

  // 定义 SQL 关键字数组
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
    'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
    'UNION', 'AND', 'OR', 'NOT', 'LIKE', 'IN', 'BETWEEN', 'AS'
  ];

  // 根据关键字换行和缩进
  const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
  const formattedSQL = sql.split(keywordRegex).map((part, index) => {
    // 为关键字添加换行和缩进
    if (keywords.some(keyword => keyword.toLowerCase() === part.toLowerCase())) {
      return `\n  ${part.toUpperCase()}`;
    }
    return part;
  }).join('');

  return formattedSQL.trim();
}
