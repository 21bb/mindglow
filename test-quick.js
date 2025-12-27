// 快速功能测试脚本
// 运行方式: node test-quick.js

import { classifyThought } from './geminiService.js';
import { ThoughtCategory } from './types.js';

console.log('🧪 开始测试 MindGlow 项目...\n');

// 测试用例
const testCases = [
  {
    name: '疗愈测试',
    text: '总是想起面试搞砸的表现',
    expectedCategory: ThoughtCategory.TRAUMA
  },
  {
    name: '待办测试',
    text: '下周三写完伦理报告初稿',
    expectedCategory: ThoughtCategory.TODO
  },
  {
    name: '灵感测试',
    text: '设计一栋会随季节变形的建筑',
    expectedCategory: ThoughtCategory.CREATIVE
  }
];

async function runTests() {
  // 检查环境变量
  if (!process.env.API_KEY && !process.env.GEMINI_API_KEY) {
    console.log('⚠️  警告: 未设置 GEMINI_API_KEY 环境变量');
    console.log('   分类功能将返回默认值，但其他功能仍可测试\n');
    console.log('   要测试 AI 功能，请创建 .env.local 文件并设置:');
    console.log('   GEMINI_API_KEY=your_api_key_here\n');
  }

  console.log('📋 测试用例:');
  testCases.forEach((test, index) => {
    console.log(`   ${index + 1}. ${test.name}: "${test.text}"`);
    console.log(`      期望分类: ${test.expectedCategory}\n`);
  });

  // 如果有 API Key，运行实际测试
  if (process.env.API_KEY || process.env.GEMINI_API_KEY) {
    console.log('🚀 开始运行 AI 分类测试...\n');
    
    for (const test of testCases) {
      try {
        console.log(`测试: ${test.name}`);
        console.log(`输入: "${test.text}"`);
        
        const result = await classifyThought(test.text);
        
        console.log(`结果: ${result.category}`);
        console.log(`匹配: ${result.category === test.expectedCategory ? '✅' : '❌'}`);
        
        if (result.advice) {
          console.log(`建议: ${result.advice.substring(0, 50)}...`);
        }
        if (result.tags && result.tags.length > 0) {
          console.log(`标签: ${result.tags.join(', ')}`);
        }
        
        console.log('');
      } catch (error) {
        console.error(`❌ 测试失败: ${error.message}\n`);
      }
    }
  } else {
    console.log('💡 提示: 设置 API Key 后可以运行完整的 AI 测试');
  }

  console.log('✅ 基础测试完成！');
  console.log('\n📝 下一步:');
  console.log('   1. 在浏览器中打开 http://localhost:3000');
  console.log('   2. 测试界面交互功能');
  console.log('   3. 查看 TESTING.md 获取完整测试清单');
}

runTests().catch(console.error);

