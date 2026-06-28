export const exportCvPdf = async (resume) => {

    const formatLanguageLevel = (level) =>
      level === 'NATIVE' ? 'Nativo' : level;

    const escapeHtml = (value = '') =>
    String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
    const initials = (resume.name || '')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);

    const printableLanguages = resume.languages
      .filter((language) => language.name)
      .map((language) => `<li>${escapeHtml(language.name)}${language.level ? ` - ${escapeHtml(formatLanguageLevel(language.level))}` : ''}</li>`)
      .join('');

    const printableExperiences = resume.experiences
      .filter((item) => item.position || item.company)
      .map(
        (item) => `
          <article class="experience-item">
            <p><strong>${escapeHtml(item.position || 'Puesto')}${item.company ? `, ${escapeHtml(item.company)}` : ''}</strong>${item.startDate || item.endDate ? `, ${escapeHtml([item.startDate, item.endDate].filter(Boolean).join(' - '))}` : ''}</p>
            ${item.description ? `<ul><li>${escapeHtml(item.description)}</li></ul>` : ''}
          </article>
        `
      )
      .join('');

    const printableEducation = resume.education
      .filter((item) => item.institution || item.major)
      .map(
        (item) => `
          <article class="education-item">
            <p class="education-title">${escapeHtml(item.major || 'Título académico')} <span>${escapeHtml([item.startDate, item.endDate].filter(Boolean).join(' - '))}</span></p>
            <p><strong>${escapeHtml(item.institution)}</strong></p>
          </article>
        `
      )
      .join('');

    const printWindow = window.open('', '_blank', 'width=900,height=700');

    if (!printWindow) {
      setMessage({ type: 'error', text: 'No se pudo abrir la exportación. Habilita las ventanas emergentes e inténtalo de nuevo.' });
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html lang="es">
        <head>
          <title>CV - ${escapeHtml(resume.name)}</title>
          <style>
            * { box-sizing: border-box; }
            body { background: #111; color: #242424; font-family: Georgia, 'Times New Roman', serif; font-size: 14px; line-height: 1.35; margin: 0; }
            .resume { background: #fff; margin: 20px auto; max-width: 790px; min-height: 1080px; padding: 54px 48px; }
            .header { align-items: center; display: grid; gap: 24px; grid-template-columns: 68px 1fr 220px; margin-bottom: 28px; }
            .initials { align-items: center; background: #4d747d; color: #fff; display: flex; font-size: 18px; height: 64px; justify-content: center; letter-spacing: 2px; width: 64px; }
            .header h1 { color: #4d747d; font-size: 29px; font-weight: 500; letter-spacing: 7px; line-height: 1.2; margin: 0; text-transform: uppercase; }
            .contact { font-size: 13px; line-height: 1.65; }
            .section { margin-bottom: 25px; }
            h2 { border-bottom: 1.5px solid #242424; color: #4d747d; font-size: 16px; letter-spacing: 2px; margin: 0 0 11px; padding-bottom: 5px; text-transform: uppercase; }
            p { margin: 0; }
            ul { margin: 6px 0 0; padding-left: 20px; }
            li { margin-bottom: 4px; }
            .skills { columns: 2; column-gap: 42px; }
            .skills li { break-inside: avoid; }
            .education-item, .experience-item { margin-bottom: 13px; }
            .education-title { display: flex; justify-content: space-between; }
            .education-item strong, .experience-item strong { letter-spacing: 1px; }
            .empty { color: #777; font-style: italic; }
            @page { margin: 0; size: A4; }
            @media print { body { background: #fff; } .resume { margin: 0; max-width: none; min-height: 100vh; } }
          </style>
        </head>
        <body>
          <div class="resume">
            <header class="header">
              <div class="initials">${escapeHtml(initials)}</div>
              <h1>${escapeHtml(resume.name)}</h1>
              <div class="contact">
                <p>${escapeHtml(resume.email)}</p>
                <p>${escapeHtml([resume.city, resume.location].filter(Boolean).join(', '))}</p>
              </div>
            </header>
            <section class="section">
              <h2>Resumen profesional</h2>
              <p>${escapeHtml(resume.summary || 'Describe brevemente tu experiencia, fortalezas y objetivos.')}</p>
            </section>
            <section class="section">
              <h2>Aptitudes</h2>
              <ul class="skills">
            ${resume.skills
                ?.map((skill) => `<li>${escapeHtml(typeof skill === 'string' ? skill : skill.name)}</li>`)
                .join('') || '<li class="empty">Sin habilidades agregadas.</li>'}
            </ul>
            </section>
            <section class="section">
              <h2>Formación académica</h2>
              ${printableEducation || '<p class="empty">Sin educación agregada.</p>'}
            </section>
            <section class="section">
              <h2>Idiomas</h2>
              <ul>${printableLanguages || '<li class="empty">Sin idiomas agregados.</li>'}</ul>
            </section>
            <section class="section">
              <h2>Experiencia</h2>
              ${printableExperiences || '<p class="empty">Sin experiencia laboral agregada.</p>'}
            </section>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setMessage(null);
    setResultDialog({
      title: 'CV exportado',
      description: 'Tu CV fue preparado correctamente para exportarlo en PDF.',
      type: 'info'
    });

};