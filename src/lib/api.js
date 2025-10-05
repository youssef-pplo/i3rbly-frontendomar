export const API_CONFIG = {
  get baseUrl(){
    if (import.meta.env.DEV) return ''
    return 'https://i3rbly.youssef.cv'
  },
  endpoints: { parse:'/v1/parse', blog:'/v1/blog', contact:'/v1/contact' },
  timeout: 15000,
}

export function useApi(){
  const config = API_CONFIG
  async function request(path, opts){
    // Create a fresh AbortController per request so a previous abort does not poison future calls
    const controller = new AbortController()
    const id = setTimeout(()=> controller.abort(), config.timeout)
    try{
      const res = await fetch(config.baseUrl + path, { ...opts, signal: controller.signal, headers: { 'Content-Type':'application/json', ...(opts?.headers||{}) } })
      clearTimeout(id)
      if (!res.ok) throw new Error('HTTP '+res.status)
      return await res.json()
    }catch(e){
      clearTimeout(id)
      const isAbort = e?.name === 'AbortError' || String(e?.message||'').toLowerCase().includes('abort')
      // In development (or when explicitly enabled), use mock data for safe local testing
      if (import.meta.env.DEV || import.meta.env.VITE_USE_MOCK === '1'){
        console.warn('API error in DEV, using mock for', path, e?.message)
        return mock(path, opts)
      }
      return { ok:false, error: isAbort ? 'timeout' : (e?.message || 'unknown') }
    }
  }
  return { request }
}

export function mock(path, opts){
  if (path.includes('/parse')){
    return { ok:true, html: '' }
  }
  if (path.includes('/blog')){
    return { ok:true, posts:[
      { id:1,  title:'أساسيات الإعراب: ما هو الإعراب؟', date:'2025-09-06', excerpt:'الإعراب هو تغيير يطرأ على أواخر الكلمات العربية تبعاً لتغير موقعها في الجملة.', content:`<p>الإعراب هو تغيير يطرأ على أواخر الكلمات العربية تبعاً لتغير موقعها في الجملة، وهو الذي يحدد وظيفة الكلمة النحوية.</p><ul><li>الرفع: الضمة.</li><li>النصب: الفتحة.</li><li>الجر: الكسرة.</li><li>الجزم: السكون.</li></ul>` },
      { id:2,  title:'علامات الإعراب الأصلية', date:'2025-09-07', excerpt:'العلامات الأصلية للإعراب هي الضمة والفتحة والكسرة والسكون.', content:`<p>أربع علامات أصلية للإعراب: الضمة، الفتحة، الكسرة، السكون مع أمثلة توضيحية.</p>` },
      { id:3,  title:'الفاعل: دليلك الكامل', date:'2025-09-08', excerpt:'الفاعل هو من قام بالفعل ويكون دائماً مرفوعاً.', content:`<p>الفاعل اسم مرفوع يدل على من قام بالفعل. قد يكون ظاهراً أو ضميراً مستتراً.</p>` },
      { id:4,  title:'الممنوع من الصرف', date:'2025-09-20', excerpt:'هو الاسم الذي لا يقبل التنوين ويجر بالفتحة في مواضع.', content:`<p>الممنوع من الصرف لا يقبل التنوين ويجر بالفتحة نيابة عن الكسرة إلا إذا أضيف أو عُرِّف بأل.</p><ul><li>العَلَم على وزن فُعَلاء.</li><li>صيغة منتهى الجموع.</li><li>العَدَل والوصفية مع الأوزان الخاصة.</li></ul>` },
      { id:5,  title:'الفرق بين النعت والحال', date:'2025-09-19', excerpt:'النعت يتبع المنعوت، والحال يبين هيئة صاحبه.', content:`<p>النعت وصف للاسم يتبعه في إعرابه. الحال يبين هيئة صاحبه ويكون منصوباً.</p><p>مثال: جاء الطالب <strong>المجتهدُ</strong> (نعت). جاء الطالب <strong>مسرعاً</strong> (حال).</p>` },
      { id:6,  title:'الأسماء الخمسة وشروط إعرابها', date:'2025-09-18', excerpt:'ترفع بالواو وتنصب بالألف وتجر بالياء بشروط.', content:`<p>الأسماء الخمسة: أب، أخ، حم، فو، ذو. تُعرب بالحروف بشروط منها الإضافة وعدم التصغير.</p>` },
      { id:7,  title:'الأفعال الخمسة وإعرابها', date:'2025-09-16', excerpt:'كل فعل مضارع اتصلت به ألف الاثنين أو واو الجماعة أو ياء المخاطبة.', content:`<p>ترفع بثبوت النون وتنصب وتجزم بحذفها: يكتب<strong>ان</strong>/تكتب<strong>ون</strong>/تكتب<strong>ين</strong>.</p>` },
      { id:8,  title:'المضاف إليه: قاعدة بسيطة', date:'2025-09-15', excerpt:'اسم مجرور يخصص ما قبله دائماً.', content:`<p>المضاف إليه اسم مجرور يوضح الاسم قبله ويخصصه، وعلامته الجر بحسب نوعه.</p>` },
      { id:9, title:'إعراب المثنى وجمع المذكر السالم', date:'2025-09-14', excerpt:'علامات فرعية للأسماء: الألف والواو والياء.', content:`<p>المثنى يُرفع بالألف وينصب ويجر بالياء. جمع المذكر السالم يُرفع بالواو وينصب ويجر بالياء.</p>` },
      { id:10, title:'إن وأخواتها: الحروف الناسخة', date:'2025-09-13', excerpt:'تنصب المبتدأ وترفع الخبر.', content:`<p>إن وأخواتها تدخل على الجملة الاسمية، فتنصب المبتدأ وترفع الخبر: إن الطالبَ مجتهدٌ.</p>` },
      { id:11, title:'كان وأخواتها: الأفعال الناسخة', date:'2025-09-12', excerpt:'ترفع الاسم وتنصب الخبر.', content:`<p>كان وأخواتها ترفع الاسم وتنصب الخبر: كان الجوُّ لطيفاً.</p>` },
      { id:12, title:'علامات الإعراب الأصلية (مراجعة)', date:'2025-09-11', excerpt:'مراجعة سريعة للعلامات الأصلية.', content:`<p>مراجعة مركزة للضمة والفتحة والكسرة والسكون مع أمثلة إضافية.</p>` },
      { id:13, title:'علامات الإعراب الفرعية', date:'2025-09-10', excerpt:'متى نستخدم الألف والواو والياء بدل الأصلية؟', content:`<p>تظهر العلامات الفرعية في التثنية، والجمع السالم، والأسماء الخمسة، ونائب عن الضمة/الفتحة/الكسرة.</p>` },
      { id:14, title:'الجملة الاسمية: المبتدأ والخبر', date:'2025-09-01', excerpt:'الركنان الأساسيان للجملة الاسمية.', content:`<p>المبتدأ مرفوع غالباً، والخبر مرفوع ويكمل المعنى. قد يتقدم الخبر أو يحذف لقرينة.</p>` },
      { id:15, title:'كيفية إعراب المفعول به', date:'2025-08-12', excerpt:'علامات نصبه وأشهر أحواله.', content:`<p>المفعول به منصوب وعلامته الفتحة أو ما ينوب عنها. قد يأتي ضميراً أو مصدراً مؤولاً.</p>` },
      { id:16, title:'الفاعل: دليلك الكامل (موسع)', date:'2025-08-24', excerpt:'أنواع الفاعل وأحكامه.', content:`<p>قد يكون الفاعل اسماً ظاهراً أو ضميراً أو مصدراً مؤولاً. يمتنع حذفه إلا لقرينة.</p>` },
      { id:17, title:'أدوات النصب والجزم للفعل المضارع', date:'2025-09-17', excerpt:'أن، لن، كي… ولم، لما، لا الناهية…', content:`<p>تنصب أدوات النصب الفعل المضارع بالفتحة، وتجزم أدوات الجزم بالسكون أو بحذف النون/حرف العلة.</p>` },
      { id:18, title:'التوابع في اللغة العربية', date:'2025-09-22', excerpt:'النعت، التوكيد، العطف، والبدل.', content:`<p>التوابع تتبع ما قبلها في الإعراب. لكل نوع أحكامه وأمثلة توضيحية.</p>` },
      { id:19, title:'أسلوب الاستثناء وإعرابه', date:'2025-09-21', excerpt:'المستثنى منه، أداة الاستثناء، المستثنى.', content:`<p>الاستثناء بـ إلا، وغير، وسوى… تتغير أحكام المستثنى حسب تام/منفي/مفرغ.</p>` }
    ] }
  }
  return { ok:false }
}


