const fs = require('fs');

let html = fs.readFileSync('./demo_cosmetic/index.html', 'utf8');
let css = fs.readFileSync('./demo_cosmetic/style.css', 'utf8');
let js = fs.readFileSync('./demo_cosmetic/script.js', 'utf8');

// Replace Text
html = html.replace(/অরিলিয়া প্যারিস ২৪কে গোল্ড সাফ্রন ব্রাইটনিং সেরাম \| Aurélia Paris Cosmetics/g, 'ম্যাজিক ফোম (Magic Foam) - প্রিমিয়াম স্পঞ্জ | Griha Nova');
html = html.replace(/ফ্রান্সের সেরা ফর্মুলায় প্রস্তুত ১০০% প্রাকৃতিক ২৪কে খাঁটি সোনা ও সাফ্রন সমৃদ্ধ প্রিমিয়াম ব্রাইটনিং সেরাম।/g, 'শুধুমাত্র পানি দিয়ে জেদি দাগ তোলার জাদুকরী ম্যাজিক ফোম স্পঞ্জ। বাংলাদেশের সেরা দামে।');
html = html.replace(/অরিলিয়া <span class="brand-gold">প্যারিস<\/span>/g, 'Griha <span class="brand-gold">Nova<\/span>');
html = html.replace(/100% BOTANICAL & LUXURY BEAUTY/g, 'PREMIUM MAGIC SPONGE');
html = html.replace(/ফ্রান্সের ফর্মুলায় প্রস্তুত ২৪কে গোল্ড কালেকশন/g, 'যে কোনো জেদি দাগ পরিষ্কারের সেরা সমাধান');
html = html.replace(/অরিলিয়া প্যারিস <span class="gold-gradient">রোজ গোল্ড হাইড্রা<\/span> ডে ক্রিম/g, '<span class="gold-gradient">ম্যাজিক ফোম (Magic Foam)<\/span> - শুধু পানিতেই দাগ গায়েব!');
html = html.replace(/ত্বক সারাদিন সতেজ, মেছতা ও রোদে পোড়া দাগ মুক্ত রাখতে এবং কাঁচের মতো সফট ও হেলদি গ্লো পেতে প্রিমিয়াম রোজ গোল্ড ও বোটানিক্যাল হাইড্রেশন ফর্মুলেশন।/g, 'দেয়ালের দাগ, জুতায় ময়লা, রান্নাঘরের তেলতেলে জেদি দাগ থেকে শুরু করে বাথরুমের টাইলস—সবকিছু একদম নতুনের মতো ঝকঝকে করুন কোনো ডিটারজেন্ট ছাড়াই!');
html = html.replace(/৳১,৬৫০/g, '৳২৯০');
html = html.replace(/৳২,৪৫০/g, '৳৪০০');
html = html.replace(/৳৮০০ \(৩৩% ছাড়\)/g, '১০ পিসের প্যাক');

// Features
html = html.replace(/✨ ২৪ ঘণ্টা ডিপ হাইড্রেশন ও সফট সিল্কি গ্লো/g, '✨ কোনো সাবান বা ডিটারজেন্ট প্রয়োজন নেই, শুধু পানিতে ভিজিয়ে ঘষলেই দাগ গায়েব!');
html = html.replace(/✨ প্রিমিয়াম ফ্রেঞ্চ রোজ এক্সট্র্যাক্ট ও বোটানিক্যাল উপাদান/g, '✨ দেয়ালের লেখা, জুতার দাগ, কিবোর্ড, টাইলস, রান্নাঘরের সিংক পরিষ্কারে ম্যাজিকের মতো কাজ করে।');
html = html.replace(/✨ সানবার্ন, ডার্ক স্পট ও ত্বকের শুষ্কতা দূরীকরণে অত্যন্ত কার্যকরী/g, '✨ আকারে কাটা যায়, তাই ছোট-বড় যেকোনো ফাঁক-ফোকরে অনায়াসে ব্যবহার করা যায়।');
html = html.replace(/✨ ডার্মাটোলজিস্ট টেস্টেড ও পার্সেল খুলে দেখে পেমেন্টের সুযোগ/g, '✨ হাই-ডেনসিটি মেলামাইন ম্যাটেরিয়াল, তাই সহজে ছিঁড়ে যায় না এবং দীর্ঘস্থায়ী।');

// Why best
html = html.replace(/অরিলিয়া কসমেটিকসের খাস ৫টি বৈশিষ্ট্য/g, 'ম্যাজিক স্পঞ্জ-এর অবিশ্বাস্য ৫টি গুণ');
html = html.replace(/১০০% অর্গানিক সাফ্রন ও ২৪কে সোনা/g, 'শুধুমাত্র পানি দিয়ে দাগ দূর');
html = html.replace(/খাঁটি সোনার কণা ও কাশ্মিরি সাফ্রনের প্রাকৃতিক উপাদান ত্বককে ভেতর থেকে উজ্জ্বল করে।/g, 'কোনো ধরনের ক্ষতিকর কেমিক্যাল বা ডিটারজেন্টের প্রয়োজন নেই। পানি দিয়ে ভিজিয়ে ঘষলেই ম্যাজিকের মতো কাজ করে।');
html = html.replace(/ডার্মাটোলজিস্ট টেস্টেড ও ১০০% সেফ/g, 'পরিবেশবান্ধব ও নিরাপদ');
html = html.replace(/কোনো ক্ষতিকর কেমিক্যাল বা পারদ \(Mercury\) নেই। সব ধরনের ত্বকে নিরাপদ।/g, 'ইকো-ফ্রেন্ডলি মেলামাইন ফোম দিয়ে তৈরি, যা হাত ও পরিবেশের জন্য ১০০% নিরাপদ।');
html = html.replace(/গ্লাস স্কিন শাইন ও অ্যান্টি-এজিং/g, 'একাধিক ব্যবহারের সুবিধা');
html = html.replace(/ত্বকের কোলাজেন উৎপাদন বাড়িয়ে সূক্ষ্ম বলিরেখা, মেছতা ও কালচে দাগ পুরোপুরি দূর করে।/g, 'বাড়ি, অফিস, রান্নাঘর, বাথরুম, জুতা, সোফা থেকে শুরু করে গাড়ির সিট পর্যন্ত পরিষ্কার করা যায় অনায়াসে।');
html = html.replace(/২৪ ঘণ্টা ডিপ হাইড্রেশন ও গ্লো/g, 'কাঁচি দিয়ে কেটে ব্যবহারের সুবিধা');
html = html.replace(/হায়ালুরোনিক অ্যাসিড ত্বককে সারাদিন সতেজ, আর্দ্র ও মাখনের মতো সফট ও মসৃণ রাখে।/g, 'আপনার প্রয়োজন অনুযায়ী স্পঞ্জটিকে ছোট বা বড় টুকরো করে কেটে ব্যবহার করতে পারবেন।');

// Variants section
html = html.replace(/আপনার ত্বকের যত্নে সেরা ৩টি প্রডাক্ট/g, 'আপনার প্রয়োজন অনুযায়ী প্যাকেজ বেছে নিন');

// Variant 1 -> 20 pcs
html = html.replace(/২৪কে গোল্ড সাফ্রন সেরাম/g, 'ম্যাজিক ফোম - ২০ পিস');
html = html.replace(/গ্লাস স্কিন উজ্জ্বলতা, মেছতা ও কালচে ছোপ দূরীকরণে সেরা ২৪কে সোনার সেরাম।/g, 'পরিবারের প্রতিদিনের পরিচ্ছন্নতার জন্য দারুণ একটি প্যাকেজ।');
html = html.replace(/৳১,৮৫০/g, '৳৪৫০');
html = html.replace(/৳৩,৫০০/g, '৳৬০০');

// Variant 2 -> 30 pcs
html = html.replace(/রোজ গোল্ড হাইড্রা ডে ক্রিম/g, 'ম্যাজিক ফোম - ৩০ পিস');
html = html.replace(/ত্বক সতেজ ও ময়েশ্চারাইজড রাখতে রোজ গোল্ড ফর্মুলার প্রিমিয়াম ডে ক্রিম।/g, 'এক মাসের জন্য নিশ্চিন্ত পরিষ্কার পরিচ্ছন্নতার বেস্ট ডিল।');
html = html.replace(/৳৪,০০০/g, '৳৮০০');

// Variant 3 -> 50 pcs
html = html.replace(/৩-ইন-১ রয়্যাল বিউটি কম্বো/g, 'ম্যাজিক ফোম - ৫০ পিস (সুপার সেভার)');
html = html.replace(/সিরাম, ডে ক্রিম ও নাইট ক্রিমের এক্সক্লুসিভ লাক্সারি কম্বো প্যাক।/g, 'বেশি স্পঞ্জ, বেশি সাশ্রয়! সারা বাড়ির পরিচ্ছন্নতায় নিশ্চিন্ত সমাধান।');
html = html.replace(/৳২,৯৫০/g, '৳৮৯০');
html = html.replace(/৳৫,৯৫০/g, '৳১২০০');

// Fix Thumbnails Images
html = html.replace(/images\/cream.jpg/g, '/lp/magic-foam/images/cream.jpg'); // Can replace with actual later
html = html.replace(/images\/hero.jpg/g, '/lp/magic-foam/images/hero.jpg');
html = html.replace(/images\/combo.jpg/g, '/lp/magic-foam/images/combo.jpg');

// Fix package HTML in the form
const packageHtml = `
            <div class="package-options">
              <label class="package-card-pill active">
                <input type="radio" name="package" value="10 Pcs Magic Sponge" data-price="290" checked>
                <div class="pill-content">
                  <span class="pkg-name">১০ পিস প্যাক</span>
                  <span class="pkg-price">৳২৯০</span>
                </div>
              </label>

              <label class="package-card-pill">
                <input type="radio" name="package" value="20 Pcs Magic Sponge" data-price="450">
                <div class="pill-content">
                  <span class="pkg-name">২০ পিস প্যাক</span>
                  <span class="pkg-price">৳৪৫০</span>
                </div>
              </label>
              
              <label class="package-card-pill">
                <input type="radio" name="package" value="30 Pcs Magic Sponge" data-price="590">
                <div class="pill-content">
                  <span class="pkg-name">৩০ পিস প্যাক</span>
                  <span class="pkg-price">৳৫৯০</span>
                </div>
              </label>

              <label class="package-card-pill">
                <input type="radio" name="package" value="50 Pcs Magic Sponge" data-price="890">
                <div class="pill-content">
                  <span class="pkg-name">৫০ পিস প্যাক (হট ডিল)</span>
                  <span class="pkg-price">৳৮৯০</span>
                </div>
              </label>

              <label class="package-card-pill">
                <input type="radio" name="package" value="100 Pcs Magic Sponge" data-price="1490">
                <div class="pill-content">
                  <span class="pkg-name">১০০ পিস প্যাক (মেগা ডিল)</span>
                  <span class="pkg-price">৳১৪৯০</span>
                </div>
              </label>
            </div>
`;
html = html.replace(/<div class="package-options">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<!-- Quantity/m, packageHtml + '</div></div></div><!-- Quantity');

// Update Form Submission JS
let newJs = js.replace(/fetch\('https:\/\/script.google.com[\s\S]*?}\)\.catch/m, `
    const orderData = {
        name: formData.get('customerName'),
        phone_no: formData.get('customerPhone'),
        shipping_address: formData.get('customerAddress'),
        division: formData.get('deliveryArea') === 'Inside Dhaka' ? 'inside-dhaka' : 'outside-dhaka',
        product_id: 'MAGIC_FOAM_PRODUCT_ID',
        quantity: formData.get('quantity') || 1,
        deliveryCharge: parseInt(document.getElementById('shipping-cost').textContent),
        note: 'Package: ' + formData.get('package') + '\\nOrder Note: ' + formData.get('orderNote')
    };
    
    fetch('/api/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    }).then(res => res.json()).then(data => {
        if(!data.success) throw new Error(data.message || 'Order failed');
        window.location.href = '/success-order?orderId=' + (data.data?.orderId || '12345');
    }).catch`);

newJs = newJs.replace(/window\.location\.href = 'thank-you\.html';/g, ''); // Handled above

// Assemble Astro Component
const bodyContent = html.split('<body>')[1].split('</body>')[0];

const astroContent = `---
import '../../styles/global.css';
---

<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <title>Magic Foam Sponge - Griha Nova</title>
    <style>
        ${css}
    </style>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet">
</head>
<body>
    ${bodyContent}
    <script is:inline>
        ${newJs}
    </script>
</body>
</html>`;

fs.writeFileSync('src/pages/lp/magic-foam.astro', astroContent);
