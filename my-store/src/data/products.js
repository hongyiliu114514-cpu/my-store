import sunglassesImg from '../assets/sunglasses.jpg';

const products = [
  { 
    id: 1, 
    name: '经典帆布包', 
    price: 299, 
    sales: 168,
    category: '包袋',
    image: 'https://placehold.co/400x400/e2e8f0/64748b?text=帆布包',
    description: '优质帆布材质，简约设计，大容量收纳，日常通勤首选。',
    details: ['材质：纯棉帆布', '尺寸：35cm x 25cm x 12cm', '颜色：米白/黑色可选', '承重：最高5kg']
  },
  { 
    id: 2, 
    name: '极简手表', 
    price: 599, 
    sales: 89,
    category: '配饰',
    image: 'https://placehold.co/400x400/e2e8f0/64748b?text=手表',
    description: '极简表盘设计，真皮表带，日本机芯，商务休闲两相宜。',
    details: ['表盘直径：40mm', '表带材质：真皮', '防水：3ATM', '保修期：2年']
  },
  { 
    id: 3, 
    name: '复古太阳镜', 
    price: 199, 
    sales: 256,
    category: '配饰',
    image: sunglassesImg,
    description: '经典复古圆框，偏光镜片，UV400防护，春夏出行必备。',
    details: ['镜框材质：金属', '镜片：偏光防紫外线', '重量：28g', '附赠眼镜盒']
  },
  { 
    id: 4, 
    name: '纯棉T恤', 
    price: 159, 
    sales: 432,
    category: '服饰',
    image: 'https://placehold.co/400x400/e2e8f0/64748b?text=T恤',
    description: '100%精梳棉，宽松版型，亲肤透气，四季百搭基础款。',
    details: ['材质：100%精梳棉', '版型：宽松落肩', '克重：220g', '尺码：S/M/L/XL']
  },
  { 
    id: 5, 
    name: '斜挎胸包', 
    price: 259, 
    sales: 65,
    category: '包袋',
    image: 'https://placehold.co/400x400/e2e8f0/64748b?text=胸包',
    description: '防水尼龙面料，多隔层设计，轻便出行，通勤运动皆可。',
    details: ['材质：防水尼龙', '尺寸：20cm x 15cm x 6cm', '隔层：3个主袋', '肩带可调节']
  },
  { 
    id: 6, 
    name: '编织腰带', 
    price: 129, 
    sales: 112,
    category: '配饰',
    image: 'https://placehold.co/400x400/e2e8f0/64748b?text=腰带',
    description: '弹力编织工艺，无孔设计，自由调节松紧，舒适不勒腰。',
    details: ['材质：弹力织带', '宽度：3.5cm', '扣头：合金', '适用腰围：80-110cm']
  },
];

export default products;
