// 工具函数
function getListCode(projectName) {
  const name = projectName;
  // 1. 空气加热/冷却
  if (name.includes('空气加热') || name.includes('空气冷却')) {
    return '030701001';
  }
  // 2. 除尘/除污
  if (name.includes('除尘') || name.includes('除污')) {
    return '030701002';
  }
  // 4. 风机盘管
  if (name.includes('风机盘管') || name.includes('风盘')) {
    return '030701004';
  }
  // 5. 除湿
  if (name.includes('除湿')) {
    return '030701014';
  }
  // 6. 过滤吸收器
  if (name.includes('过滤吸收器')) {
    return '030701015';
  }
  // 7. 油烟
  if (name.includes('油烟')) {
    return '030701016';
  }
  // 8. 变风量
  if (name.includes('变风量')) {
    return '030701017';
  }
  // 3. 空调器类
  const acKeywords = ['分体空调', '室外机', '室内机', '空调机组', '新风', '空气幕', '组合式空调', '机组'];
  if (acKeywords.some(k => name.includes(k))) {
    return '030701003';
  }
  // 9. 通风机类
  const fanKeywords = ['送风', '排风', '补风', '排烟', '加压', '管道', '通风', '排气扇', '换气扇', '混流', '风机'];
  if (fanKeywords.some(k => name.includes(k))) {
    return '030701301';
  }
  return '';
}

function extractAirVolume(projectName) {
  const match = projectName.match(/(\d+)\s*m[3³]\/h/i);
  return match ? match[1] + 'm³/h' : '';
}

// 生成广联达格式项目特征
function generateProjectFeature_GLodon(projectName, airVolume) {
  return `1.名称：${projectName}
2.规格：${airVolume || ''}
3.包含：减震装置、落地设备基础、吊装设备支吊架及除锈刷油
4.其他：满足招标图纸、招标文件、技术标准及相关图集规范要求`;
}

// 生成建经科技格式项目特征
function generateProjectFeature_JianJing(projectName) {
  return `项目特征：
1.${projectName}
2.其他详见招标文件、设计图纸及相关规范
工程内容：
1.购置、安装
2.控制箱及控制箱至设备管线购置、安装
3.设备支架制作、安装
4.金属结构除锈刷油
5.设置橡胶隔振垫、减震器或减震吊架
6.参照图纸及招标文件的技术要求
7.满足施工及验收相关规范要求
8.为完成该项工作内容所需的辅助工作请投标人在综合单价中考虑，达到竣工交验标准`;
}

// 根据当前选择的软件格式生成项目特征
function generateProjectFeature(projectName, airVolume) {
  const format = document.getElementById('formatSelect').value;
  if (format === 'jianjing') {
    return generateProjectFeature_JianJing(projectName);
  } else {
    return generateProjectFeature_GLodon(projectName, airVolume);
  }
}

function getAirVolumeValue(airVolumeStr) {
  const match = airVolumeStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function getQuotaCode(projectName, fanType, airVolumeStr) {
  const name = projectName;
  const airVolume = getAirVolumeValue(airVolumeStr);

  // 1. 空气加热/冷却
  if (name.includes('空气加热') || name.includes('空气冷却')) {
    return '9-230';
  }

  // 4. 卫生间/排气扇
  if (name.includes('卫生间') || name.includes('排气扇') || name.includes('排风扇')) {
    return '9-247';
  }

  // 9. 除尘/除污
  if (name.includes('除尘') || name.includes('除污')) {
    return '9-275';
  }

  // 8. 油烟净化
  if (name.includes('油烟') || name.includes('净化')) {
    if (airVolume <= 3000) return '9-271';
    if (airVolume <= 10000) return '9-272';
    if (airVolume <= 30000) return '9-273';
    return '9-274';
  }

  // 6. 风机盘管
  if (name.includes('风机盘管') || name.includes('风盘')) {
    if (name.includes('落地')) return '9-265';
    if (name.includes('壁挂')) return '9-267';
    if (name.includes('卡式')) return '9-268';
    return '9-266';
  }

  // 7. 室内机/变风量末端
  if (name.includes('室内机') || name.includes('变风量末端') || name.includes('VAV') || name.includes('VRV')) {
    return '9-269';
  }

  // 5. 空调器类
  const isAC = ['分体空调', '室外机', '室内机', '空调机组', '新风', '空气幕', '组合式空调', '机组'].some(k => name.includes(k));
  if (isAC) {
    // 优先组合式
    if (name.includes('组合式') || name.includes('空调机组') || name.includes('机组')) {
      if (airVolume <= 4000) return '9-257';
      if (airVolume <= 10000) return '9-258';
      if (airVolume <= 20000) return '9-259';
      if (airVolume <= 40000) return '9-260';
      if (airVolume <= 60000) return '9-261';
      if (airVolume <= 80000) return '9-262';
      if (airVolume <= 100000) return '9-263';
      return '9-264';
    }
    // 安装方式
    if (name.includes('吊顶')) return '9-248';
    if (name.includes('落地')) return '9-251';
    if (name.includes('壁装') || name.includes('墙上')) return '9-254';
    return '9-251';
  }

  // 2、3. 风机类
  const isFan = ['送风', '排风', '补风', '排烟', '加压', '管道', '通风', '排气扇', '换气扇', '混流', '风机'].some(k => name.includes(k));
  if (isFan) {
    if (fanType === '离心风机' || fanType === '离心') {
      if (airVolume <= 4500) return '9-233';
      if (airVolume <= 10000) return '9-234';
      if (airVolume <= 20000) return '9-235';
      if (airVolume <= 50000) return '9-236';
      if (airVolume <= 123000) return '9-237';
      return '9-238';
    } else {
      if (airVolume <= 8900) return '9-239';
      if (airVolume <= 25000) return '9-240';
      if (airVolume <= 63000) return '9-241';
      if (airVolume <= 140000) return '9-242';
      return '9-243';
    }
  }

  return '';
}

// 设备价格数据库（国产中高档品牌，2026年市场参考价）
const equipmentPriceDB = {
  // 风机类 - 亿利达品牌（国产中高档）
  fan_yilida: [
    { minAirVolume: 0, maxAirVolume: 5000, price: 1800, brand: '亿利达' },
    { minAirVolume: 5000, maxAirVolume: 10000, price: 3200, brand: '亿利达' },
    { minAirVolume: 10000, maxAirVolume: 15000, price: 4800, brand: '亿利达' },
    { minAirVolume: 15000, maxAirVolume: 20000, price: 6500, brand: '亿利达' },
    { minAirVolume: 20000, maxAirVolume: 30000, price: 9200, brand: '亿利达' },
    { minAirVolume: 30000, maxAirVolume: 40000, price: 12500, brand: '亿利达' },
    { minAirVolume: 40000, maxAirVolume: 50000, price: 16800, brand: '亿利达' },
    { minAirVolume: 50000, maxAirVolume: 60000, price: 21000, brand: '亿利达' },
    { minAirVolume: 60000, maxAirVolume: 80000, price: 28500, brand: '亿利达' },
    { minAirVolume: 80000, maxAirVolume: 100000, price: 36000, brand: '亿利达' },
    { minAirVolume: 100000, maxAirVolume: 150000, price: 48000, brand: '亿利达' }
  ],
  
  // 组合式空调机组 - 约克品牌（国际中高档）
  ahu_york: [
    { minAirVolume: 0, maxAirVolume: 4000, price: 12500, brand: '约克' },
    { minAirVolume: 4000, maxAirVolume: 8000, price: 22000, brand: '约克' },
    { minAirVolume: 8000, maxAirVolume: 12000, price: 32000, brand: '约克' },
    { minAirVolume: 12000, maxAirVolume: 20000, price: 48000, brand: '约克' },
    { minAirVolume: 20000, maxAirVolume: 30000, price: 68000, brand: '约克' },
    { minAirVolume: 30000, maxAirVolume: 40000, price: 92000, brand: '约克' },
    { minAirVolume: 40000, maxAirVolume: 60000, price: 128000, brand: '约克' },
    { minAirVolume: 60000, maxAirVolume: 80000, price: 165000, brand: '约克' },
    { minAirVolume: 80000, maxAirVolume: 100000, price: 210000, brand: '约克' }
  ],
  
  // 新风机组 - 麦克维尔品牌（国际中高档）
  fcu_mcquay: [
    { minAirVolume: 0, maxAirVolume: 2000, price: 6800, brand: '麦克维尔' },
    { minAirVolume: 2000, maxAirVolume: 4000, price: 11500, brand: '麦克维尔' },
    { minAirVolume: 4000, maxAirVolume: 6000, price: 16200, brand: '麦克维尔' },
    { minAirVolume: 6000, maxAirVolume: 10000, price: 24500, brand: '麦克维尔' },
    { minAirVolume: 10000, maxAirVolume: 15000, price: 35000, brand: '麦克维尔' },
    { minAirVolume: 15000, maxAirVolume: 20000, price: 46000, brand: '麦克维尔' }
  ],
  
  // 风机盘管 - 开利品牌（国际中高档）
  fcu_carrier: [
    { type: 'FP-34', price: 850, brand: '开利' },
    { type: 'FP-51', price: 980, brand: '开利' },
    { type: 'FP-68', price: 1150, brand: '开利' },
    { type: 'FP-85', price: 1350, brand: '开利' },
    { type: 'FP-102', price: 1580, brand: '开利' },
    { type: 'FP-136', price: 1850, brand: '开利' },
    { type: 'FP-170', price: 2200, brand: '开利' },
    { type: 'FP-204', price: 2650, brand: '开利' },
    { type: 'FP-238', price: 3100, brand: '开利' }
  ],
  
  // 排气扇/卫生间通风器 - 正野品牌（国产中高档）
  exhaust_fan: [
    { type: 'BPT12-14C', price: 280, brand: '正野' },
    { type: 'BPT15-23C', price: 360, brand: '正野' },
    { type: 'BPT18-34C', price: 450, brand: '正野' },
    { type: 'DPT15-42A', price: 580, brand: '正野' },
    { type: 'DPT20-54A', price: 720, brand: '正野' }
  ],
  
  // 油烟净化机组 - 科蓝品牌（国产中高档）
  fume_purifier: [
    { minAirVolume: 0, maxAirVolume: 4000, price: 8500, brand: '科蓝' },
    { minAirVolume: 4000, maxAirVolume: 8000, price: 15800, brand: '科蓝' },
    { minAirVolume: 8000, maxAirVolume: 12000, price: 24500, brand: '科蓝' },
    { minAirVolume: 12000, maxAirVolume: 20000, price: 38000, brand: '科蓝' },
    { minAirVolume: 20000, maxAirVolume: 30000, price: 55000, brand: '科蓝' },
    { minAirVolume: 30000, maxAirVolume: 50000, price: 85000, brand: '科蓝' }
  ]
};

// 获取设备价格及品牌信息
function getEquipmentPriceInfo(projectName, airVolumeStr) {
  const name = projectName;
  const airVolume = getAirVolumeValue(airVolumeStr);
  
  // 1. 风机类 - 亿利达品牌
  const isFanType = ['送风', '排风', '补风', '排烟', '加压', '通风', '风机'].some(k => name.includes(k));
  if (isFanType) {
    const priceItem = equipmentPriceDB.fan_yilida.find(item => 
      airVolume >= item.minAirVolume && airVolume < item.maxAirVolume
    ) || equipmentPriceDB.fan_yilida[equipmentPriceDB.fan_yilida.length - 1];
    return { price: priceItem.price, brand: priceItem.brand };
  }
  
  // 2. 组合式空调机组 - 约克品牌
  if (name.includes('组合式') || name.includes('空调机组')) {
    const priceItem = equipmentPriceDB.ahu_york.find(item => 
      airVolume >= item.minAirVolume && airVolume < item.maxAirVolume
    ) || equipmentPriceDB.ahu_york[equipmentPriceDB.ahu_york.length - 1];
    return { price: priceItem.price, brand: priceItem.brand };
  }
  
  // 3. 新风机组 - 麦克维尔品牌
  if (name.includes('新风')) {
    const priceItem = equipmentPriceDB.fcu_mcquay.find(item => 
      airVolume >= item.minAirVolume && airVolume < item.maxAirVolume
    ) || equipmentPriceDB.fcu_mcquay[equipmentPriceDB.fcu_mcquay.length - 1];
    return { price: priceItem.price, brand: priceItem.brand };
  }
  
  // 4. 风机盘管 - 开利品牌
  if (name.includes('风机盘管') || name.includes('风盘')) {
    // 尝试从名称中提取FP型号
    const fpMatch = name.match(/FP-(\d+)/i);
    if (fpMatch) {
      const fpType = `FP-${fpMatch[1]}`;
      const priceItem = equipmentPriceDB.fcu_carrier.find(item => item.type === fpType);
      if (priceItem) return { price: priceItem.price, brand: priceItem.brand };
    }
    // 默认FP-85
    return { price: 1350, brand: '开利' };
  }
  
  // 5. 排气扇/卫生间通风器 - 正野品牌
  if (name.includes('卫生间') || name.includes('排气扇') || name.includes('排风扇')) {
    return { price: 360, brand: '正野' };
  }
  
  // 6. 油烟净化机组 - 科蓝品牌
  if (name.includes('油烟') || name.includes('净化')) {
    const priceItem = equipmentPriceDB.fume_purifier.find(item => 
      airVolume >= item.minAirVolume && airVolume < item.maxAirVolume
    ) || equipmentPriceDB.fume_purifier[equipmentPriceDB.fume_purifier.length - 1];
    return { price: priceItem.price, brand: priceItem.brand };
  }
  
  return { price: '', brand: '' };
}

function getEquipmentFee(projectName, airVolumeStr) {
  const priceInfo = getEquipmentPriceInfo(projectName, airVolumeStr);
  return priceInfo.price;
}

function getEquipmentBrand(projectName, airVolumeStr) {
  const priceInfo = getEquipmentPriceInfo(projectName, airVolumeStr);
  return priceInfo.brand;
}

function getQuotaName(quotaCode) {
  const quotaMap = {
    '9-230': '空气加热器（冷却器）安装',
    '9-233': '离心式通风机安装 风量4500m³/h以内',
    '9-234': '离心式通风机安装 风量10000m³/h以内',
    '9-235': '离心式通风机安装 风量20000m³/h以内',
    '9-236': '离心式通风机安装 风量50000m³/h以内',
    '9-237': '离心式通风机安装 风量123000m³/h以内',
    '9-238': '离心式通风机安装 风量123000m³/h以外',
    '9-239': '轴流式、斜流式、混流式通风机安装 风量8900m³/h以内',
    '9-240': '轴流式、斜流式、混流式通风机安装 风量25000m³/h以内',
    '9-241': '轴流式、斜流式、混流式通风机安装 风量63000m³/h以内',
    '9-242': '轴流式、斜流式、混流式通风机安装 风量140000m³/h以内',
    '9-243': '轴流式、斜流式、混流式通风机安装 风量140000m³/h以外',
    '9-247': '卫生间通风器安装',
    '9-248': '吊顶式空调器安装 质量0.15t以内',
    '9-251': '落地式空调器安装 质量1.0t以内',
    '9-254': '墙上式空调器安装 质量0.1t以内',
    '9-257': '组合式空调机组安装 风量4000m³/h以内',
    '9-258': '组合式空调机组安装 风量10000m³/h以内',
    '9-259': '组合式空调机组安装 风量20000m³/h以内',
    '9-260': '组合式空调机组安装 风量40000m³/h以内',
    '9-261': '组合式空调机组安装 风量60000m³/h以内',
    '9-262': '组合式空调机组安装 风量80000m³/h以内',
    '9-263': '组合式空调机组安装 风量100000m³/h以内',
    '9-264': '组合式空调机组安装 风量100000m³/h以外',
    '9-265': '风机盘管安装 落地式',
    '9-266': '风机盘管安装 吊顶式',
    '9-267': '风机盘管安装 壁挂式',
    '9-268': '风机盘管安装 卡式',
    '9-269': '变风量末端装置安装',
    '9-271': '组合式油烟净化机组安装 风量3000m³/h以内',
    '9-272': '组合式油烟净化机组安装 风量10000m³/h以内',
    '9-273': '组合式油烟净化机组安装 风量30000m³/h以内',
    '9-274': '组合式油烟净化机组安装 风量60000m³/h以内',
    '9-275': '除尘设备安装 质量100kg以内'
  };
  return quotaMap[quotaCode] || '';
}

// 处理Excel上传
document.getElementById('excelFile').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

    // 处理数据（跳过表头，从第二行开始）
    const resultData = [];
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || row.length === 0) continue;

      const projectName = row[0] || ''; // 第一列：风机信息/项目名称
      const fanType = row[1] || '';     // 第二列：风机类型
      const unit = row[2] || '台';      // 第三列：单位，无则默认台
      const quantity = row[3] || 1;     // 第四列：数量

      const listCode = getListCode(projectName);
      const airVolume = extractAirVolume(projectName);
      const quotaCode = getQuotaCode(projectName, fanType, airVolume);
      const quotaName = getQuotaName(quotaCode);
      const equipmentFee = getEquipmentFee(projectName, airVolume);
      const equipmentBrand = getEquipmentBrand(projectName, airVolume);
      const projectFeature = generateProjectFeature(projectName, airVolume);

      resultData.push({
        index: i,
        listCode,
        projectName,
        airVolume,
        fanType,
        quotaCode,
        quotaName,
        equipmentFee,
        equipmentBrand,
        unit,
        quantity,
        projectFeature
      });
    }

    // 渲染表格
    renderTable(resultData);
    document.getElementById('resultArea').style.display = 'block';

    // 保存数据用于导出
    window.exportData = resultData;
  };
  reader.readAsArrayBuffer(file);
});

function renderTable(data) {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';

  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.index}</td>
      <td>${row.listCode}</td>
      <td>${row.projectName}</td>
      <td>${row.airVolume}</td>
      <td>${row.fanType}</td>
      <td>${row.equipmentBrand || ''}</td>
      <td>${row.quotaCode}</td>
      <td>${row.quotaName}</td>
      <td>${row.equipmentFee || ''}</td>
      <td>${row.unit}</td>
      <td>${row.quantity}</td>
      <td style="white-space: pre-line; text-align: left; padding: 8px;">${row.projectFeature}</td>
    `;
    tbody.appendChild(tr);
  });
}

// 格式切换时重新渲染表格
document.getElementById('formatSelect').addEventListener('change', function() {
  if (window.exportData && window.exportData.length > 0) {
    // 重新生成项目特征并渲染表格
    window.exportData.forEach(row => {
      row.projectFeature = generateProjectFeature(row.projectName, row.airVolume);
    });
    renderTable(window.exportData);
  }
});

// 导出Excel - 根据选择的软件格式（广联达/建经科技）
document.getElementById('exportBtn').addEventListener('click', function() {
  if (!window.exportData || window.exportData.length === 0) {
    alert('没有数据可导出');
    return;
  }

  const format = document.getElementById('formatSelect').value;
  
  if (format === 'jianjing') {
    // ===== 建经科技格式 - 简单1行格式 =====
    const wsData = [
      ['序号', '清单编码', '项目名称', '风量', '风机类型', '风机类型', '品牌', '定额编码', '定额名称', '设备费（元）', '单位', '数量', '项目特征']
    ];

    window.exportData.forEach(row => {
      wsData.push([
        row.index,                          // A列：序号
        row.listCode,                       // B列：清单编码
        row.projectName,                    // C列：项目名称
        row.airVolume,                      // D列：风量
        row.fanType,                        // E列：风机类型
        row.fanType,                        // F列：风机类型（重复）
        row.equipmentBrand || '',           // G列：品牌
        row.quotaCode,                      // H列：定额编码
        row.quotaName,                      // I列：定额名称
        row.equipmentFee || '',             // J列：设备费
        row.unit,                           // K列：单位
        row.quantity,                       // L列：数量
        row.projectFeature                  // M列：项目特征
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '通风空调设备清单');
    XLSX.writeFile(wb, '通风空调设备清单定额结果_建经科技.xlsx');

  } else {
    // ===== 广联达格式 - 每清单项3行格式 =====
    const wsData = [
      ['序号', '项目名称', '风量', '风机类型', '品牌', '工程量', '项目编码', '', '名称', '项目特征', '单位', '工程量', '主材单价']
    ];

    window.exportData.forEach((row, idx) => {
      const itemNum = idx + 1; // 清单项序号（1,2,3...）
      const excelRow1 = wsData.length + 1; // 清单行Excel行号
      const excelRow2 = excelRow1 + 1;    // 定额行Excel行号
      const excelRow3 = excelRow1 + 2;    // 未计价材行Excel行号

      // ===== 第1行：清单行 =====
      wsData.push([
        itemNum,                            // A列：序号
        row.projectName,                    // B列：项目名称
        row.airVolume,                      // C列：风量
        row.fanType,                        // D列：风机类型
        row.equipmentBrand || '',           // E列：品牌
        row.quantity,                       // F列：工程量（数量）
        row.listCode,                       // G列：清单编码
        '清单行',                           // H列：固定"清单行"
        row.projectName,                    // I列：项目名称（同B列）
        row.projectFeature,                 // J列：项目特征
        row.unit,                           // K列：单位
        { f: `=F${excelRow1}` },            // L列：工程量（公式引用F列）
        row.equipmentFee || ''              // M列：主材单价（设备费）
      ]);

      // ===== 第2行：定额行 =====
      wsData.push([
        `${itemNum}.1`,                     // A列：序号.1
        '',                                 // B列：空
        '',                                 // C列：空
        '',                                 // D列：空
        '',                                 // E列：空
        '',                                 // F列：空
        row.quotaCode,                      // G列：定额编码
        '定额行',                           // H列：固定"定额行"
        row.quotaName,                      // I列：定额名称
        '',                                 // J列：空
        { f: `=K${excelRow1}` },            // K列：单位（公式引用上一行K列）
        { f: `=L${excelRow1}` },            // L列：工程量（公式引用上一行L列）
        ''                                  // M列：空
      ]);

      // ===== 第3行：未计价材行 =====
      wsData.push([
        `${itemNum}.2`,                     // A列：序号.2
        '',                                 // B列：空
        '',                                 // C列：空
        '',                                 // D列：空
        '',                                 // E列：空
        '',                                 // F列：空
        `Z00741-${String(itemNum).padStart(3, '0')}`, // G列：Z00741-001, Z00741-002...
        '未计价材行',                       // H列：固定"未计价材行"
        { f: `=I${excelRow1}` },            // I列：项目名称（公式引用清单行I列）
        '',                                 // J列：空
        { f: `=K${excelRow2}` },            // K列：单位（公式引用定额行K列）
        { f: `=L${excelRow2}` },            // L列：工程量（公式引用定额行L列）
        row.equipmentFee || ''              // M列：主材单价（设备费）
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '通风空调设备清单');
    XLSX.writeFile(wb, '通风空调设备清单定额结果_广联达.xlsx');
  }
});

// 格式选择变化时重新生成表格
document.getElementById('formatSelect').addEventListener('change', function() {
  if (window.exportData && window.exportData.length > 0) {
    // 重新生成项目特征
    window.exportData.forEach(row => {
      row.projectFeature = generateProjectFeature(row.projectName, row.airVolume);
    });
    renderTable(window.exportData);
  }
});