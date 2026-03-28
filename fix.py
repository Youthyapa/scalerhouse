import json

file_path = "c:/Users/hp/OneDrive/Desktop/ScalerHouse/lib/serviceData.new.ts"

with open(file_path, "r", encoding="utf-8", errors="replace") as f:
    lines = f.readlines()

new_content = """        description: `Branding and advertisement are the twin engines of a thriving business. While branding defines who you are — your identity, values and promise — advertisement amplifies that message to the right audience at the right time. ScalerHouse bridges both worlds, offering a complete suite from in-depth brand assessment to high-impact outdoor, print and electronic media campaigns.`,
        researchShows: [
            "As per the Confederation of Indian Industry (CII), by 2025, India is expected to become the fifth largest consumer market in the world. A steep rise in the demand for personal care products as a result of changing lifestyles, urbanisation and increased personal health awareness has boosted the growth of the rigid packaging market, especially in regions such as the Asia-Pacific.",
            "In addition to this, the pharmaceutical industry is one of the fastest growing industries globally. The need for packaging tonics, vaccines and tablets in durable and isolated packages is stimulating the rigid packaging market.",
            "The data also suggests that the packaged printing industry is growing at an annual rate of 17 per cent, commercial printing at an annual rate of around 10 per cent and digital printing at a robust growth rate of 30 per cent.",
            "As the world becomes a global village, distance and geographic boundaries are virtually disappearing. In this scenario, brand building is a prerequisite for success and profitability. Many Indian printers are making a name for themselves both in quality and competence. The ranks of Indian printers doing world class printing and winning international awards for the excellence in printing is growing. Increasing number of printers in India are also concentrating on exports and undertaking outsourcing jobs. Printing in India may be growing at 40% but the point to be noted is the capacity of the print has grown a lot more. The US printing industry’s growth is worth $200 billion per year, with the short run business being around $30 to 40 billion. If even a part of this were to come to India, it would be very dramatic.",
            "Currently printing sector is all set to become booming in India due to available technology, resource at a very economical cost. Also government is encouraging foreign direct investment into this sector. Lot of MNC’s are expected to invest in this sector due to favourable working conditions. There are numerous jobs are expected in this industry due to overall growing percentage of 18% to 36% per annum. World-wide, the annual revenue of the printing industry is over $600 Billion. The United States accounts the major share for over 25% of this business, at $160-Billion a year."
        ],
        ourServices: [
            { icon: '🔍', title: 'Brand Assessment', desc: 'If you are stuck between advertising vs branding, let us handle everything. We identify your business problems through comprehensive brand analysis, provide creative solutions to grow your brand and achieve maximum profits. By eradicating root causes, we help your brand grow sustainably.' },
            { icon: '🗞️', title: 'Print Media', desc: 'With access to major publications, we deliver your brand on paper directly to potential customers. We instil your brand in the hearts of customers through creative designs and impactful copy. We are not language specific — majorly advertising in Hindi to connect with the local audience.' },
            { icon: '🏙️', title: 'OOH Media (Out-Of-Home)', desc: 'Out-Of-Home advertising gives your brand the perfect visual presence on the streets. From paper-based branding to giant hoardings, we do it all. Activities include banners, posters, glow signs, Bus & Train panels and other POP materials that command attention.' },
            { icon: '📻', title: 'Electronic & Radio', desc: 'We do not limit your brand to visual advertising alone — we also air it on radio. Through our partners in electronic and radio communication, we advertise your brand door to door, establishing credibility and achieving a perfect balance of audio-visual communication.' },
        ],
"""

lines[178:185] = [line + "\\n" for line in new_content.split("\\n")][:-1]

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("success!")
