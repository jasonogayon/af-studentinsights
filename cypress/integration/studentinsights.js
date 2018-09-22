import moment from 'moment'

describe('Student Insights', function () {

  before(function () {
    cy.fixture('urls.json').as('urls')
    cy.fixture('personas.json').as('personas')
  })


  /*  A Principal is a user responsible for a school,
      from ensuring all students are progressing academically
      to making hiring and staffing decisions for teachers.
      They base their decisions on demographic information,
      academic progress indicators, and data about educational interventions.
  */
  context('A Principal', function () {

    beforeEach(function () { // Runs before each test
      cy.visit(this.urls.login)
      cy.get('#educator_email').type(this.personas.principal.email)
      cy.get('#educator_password').type(this.personas.principal.password)
      cy.get('[type="submit"][name="commit"]').click()
      Cypress.Cookies.preserveOnce('_homeroom_session', 'columns_selected', 'mp_3a750173b950438f725533402a41ab6b_mixpanel')
    })

    afterEach(function () { // Runs after each test
      cy.clearCookies()
    })


    it('can log in', function () {
      cy.url().should('contain', '/schools/1')
    })

    it('can log out', function () {
      cy.get('[data-method="delete"]').click()

      cy.url().should('not.contain', '/schools/1')
      cy.get('#educator_email').should('be.visible')
      cy.get('#educator_password').should('be.visible')
      cy.get('[type="submit"][name="commit"]').should('be.visible')
    })

    it('can learn how many homerooms there are for every grade', function () {
      cy.get('div.FixedTable.panel').contains('Grade').next().children('tbody').children('tr')
        .each(($el) => { // Loop through all the Grade filter options
          cy.wrap($el).click()

          cy.get('div.FixedTable.panel').contains('Homeroom').then(($homeroom) => {
            if ($homeroom.siblings().find('div').length) {
              $homeroom.siblings().find('div').click() // Click 'Show all' link if it exists
            }
            cy.get('div.FixedTable.panel').contains('Homeroom').next().children('tbody').children('tr')
              .should('have.length.greaterThan', 0)
          })

          // Clear filters after viewing distribution
          cy.get('div.summary a').contains('Clear').click()
        })
    })

    it('can check if children eligible for free lunch are evenly distributed among homerooms for each grade', function () {
      cy.get('div.FixedTable.panel').contains('Grade').next().children('tbody').children('tr')
        .each(($el) => { // Loop through all the Grade filter options
          cy.wrap($el).click()

          cy.get('div.FixedTable.panel').contains('Homeroom').then(($homeroom) => {
            // But check distribution only for grades with more than one homeroom
            if ($homeroom.next().children('tbody').children('tr').length > 1) {

              // See homeroom distribution, first without free lunch filter
              cy.get('div.FixedTable.panel').contains('Homeroom').next().children('tbody').children('tr')
                .each(($el) => {
                  console.log($el.text())
                })

              // Then see homeroom distribution again, this time with free lunch filter
              cy.get('div.FixedTable.panel').contains('Low Income').next().children('tbody').children('tr')
                .contains('Free Lunch').click()
              cy.get('div.FixedTable.panel').contains('Homeroom').next().children('tbody').children('tr')
                .each(($el) => {
                  console.log($el.text())
                })

            }
          })

          // Clear filters after viewing distribution
          cy.get('div.summary a').contains('Clear').click()
        })
    })

    it('can check if children are well distributed with respect to their English fluency', function () {
      cy.get('div.FixedTable.panel').contains('Grade').next().children('tbody').children('tr')
        .each(($el) => { // Loop through all the Grade filter options
          cy.wrap($el).click()

          cy.get('div.FixedTable.panel').contains('Homeroom').then(($homeroom) => {
            // But check distribution only for grades with more than one homeroom
            if ($homeroom.next().children('tbody').children('tr').length > 1) {

              // See homeroom distribution, first without fluent filter
              cy.get('div.FixedTable.panel').contains('Homeroom').next().children('tbody').children('tr')
                .each(($el) => {
                  console.log($el.text())
                })

              // Then see homeroom distribution again, this time with fluent filter
              cy.get('div.FixedTable.panel').contains('LEP').next().children('tbody').children('tr')
                .contains('Fluent').click()
              cy.get('div.FixedTable.panel').contains('Homeroom').next().children('tbody').children('tr')
                .each(($el) => {
                  console.log($el.text())
                })

            }
          })

          // Clear filters after viewing distribution
          cy.get('div.summary a').contains('Clear').click()
        })
    })

    it('can find the homeroom with the most children eligible for free lunch', function () {
      cy.get('div.FixedTable.panel').contains('Homeroom').siblings('div').click()
      cy.get('div.FixedTable.panel').contains('Low Income').next().children('tbody').children('tr')
        .contains('Free Lunch').click()

      // See homeroom distribution
      cy.get('div.FixedTable.panel').contains('Homeroom').next().children('tbody').children('tr')
        .each(($el) => {
          console.log($el.text())
          // TODO: How to tell which homeroom has the most children eligibile for free lunch?
        })
    })

    it('can download the data of children that didn’t do well in the MCAS ELA test', function () {
      cy.get('div.FixedTable.panel').contains('MCAS ELA Score').next().children('tbody').children('tr')
        .contains('None').click()
      cy.get('div.FixedTable.panel').contains('MCAS ELA Score').next().children('tbody').children('tr')
        .contains('Warning').click()
      cy.get('div.FixedTable.panel').contains('MCAS ELA Score').next().children('tbody').children('tr')
        .contains('Needs Improvement').click()

      cy.get('a').contains('Download for Excel').then(($el) => {
        let filename = $el.prop('download')
        $el.click()
        // TODO: How to tell if a file has been downloaded?
        // cy.readFile('C:/Users/admin/Downloads/' + filename).should('exist') uses a relative path
      })
    })

    it('can learn more about children with disabilities', function () {
      cy.get('div.FixedTable.panel').contains('Disability').next().children('tbody').children('tr')
        .each(($disability) => { // Loop through all the Disability filter options

          // But do not select the 'None' disability filter
          if (!$disability.text().includes('None')) {
            $disability.click()
          }
        })

        // View each student profile
        cy.get('table.students-table tr td:first-child a').each(($student) => {
          cy.visit($student.prop('href'))
          cy.url().should('contain', '/students')
        })
    })

    it('can find the student with the most absences', function () {
      cy.get('div.summary a').should('contain', 'No filters')
      cy.get('table.students-table th').contains('Absences').click().click()
      cy.get('table.students-table tr:first-child td:first-child').click()
      cy.url().should('contain', '/students')
    })

    it('can record a student’s medical condition in a Restricted Note', function () {
      cy.get('table.students-table tr:first-child td:first-child').click()
      cy.get('a.btn.btn-warning').contains('Restricted Notes').click()
      cy.get('button.btn.take-notes').click()
      cy.get('textarea').type('This student has a serious medical condition.')
      cy.get('button.btn.note-type').contains('Parent conversation').click()
      cy.get('button.btn.save').click()

      cy.get('textarea').should('not.be.visible')
      cy.get('button.btn.save').should('not.be.visible')
      cy.get('div.NoteCard:first-child').should('contain', 'Parent conversation')
      cy.get('div.NoteCard:first-child').should('contain', 'This student has a serious medical condition.')
    })

    it('can learn more about Restricted Notes', function () {
      cy.get('table.students-table tr:first-child td:first-child').click()
      cy.get('a.btn.btn-warning').contains('Restricted Notes').click()
      cy.get('div').contains('what is this?').click()
      cy.get('div.modal-help').should('be.visible')

      cy.get('div').contains('(ESC)').click()
      cy.get('div.modal-help').should('not.be.visible')
    })

    it('can see a student’s Restricted notes', function () {
      cy.visit(this.urls.studentWithRestrictedNote)
      cy.get('a.btn.btn-warning').contains('Restricted Notes').click()

      cy.get('div.NoteCard:first-child').should('contain', 'Parent conversation')
      cy.get('div.NoteCard:first-child').should('contain', 'This student has a serious medical condition.')
    })

    it('can look up a student by name', function () {
      let studentName = 'Daisy Skywalker'
      cy.get('#student-searchbar').type(studentName.split(' ')[0])
      cy.get('.ui-autocomplete.ui-front.ui-menu.ui-widget.ui-widget-content')
        .contains(studentName).click()

      cy.get('div.StudentProfilePage a:first-child').should('contain', studentName)
    })

  })


  /*  A Classroom Teacher is a user responsible a few homerooms (usually no more than 1 or 2)
      and for students attending them.
      They call out high-need students and can jump into the student's case history
      and record of previous assessments and interventions.
  */
  context('A Classroom Teacher', function () {

    beforeEach(function () { // Runs before each test
      cy.visit(this.urls.login)
      cy.get('#educator_email').type(this.personas.teacher.email)
      cy.get('#educator_password').type(this.personas.teacher.password)
      cy.get('[type="submit"][name="commit"]').click()
      Cypress.Cookies.preserveOnce('_homeroom_session', 'columns_selected', 'mp_3a750173b950438f725533402a41ab6b_mixpanel')
    })

    afterEach(function () { // Runs after each test
      cy.clearCookies()
    })


    it('can log in', function () {
      cy.url().should('contain', '/homerooms/hea-500')
    })

    it('can log out', function () {
      cy.get('[data-method="delete"]').click()

      cy.url().should('not.contain', '/schools/1')
      cy.get('#educator_email').should('be.visible')
      cy.get('#educator_password').should('be.visible')
      cy.get('[type="submit"][name="commit"]').should('be.visible')
    })

    it('don’t have access to the school’s roster at /schools/1', function () {
      cy.visit(this.urls.home.schools + "1")

      cy.url().should('contain', '/homerooms/hea-500') // Redirects back to homerooms page
    })

    it('can easily switch between the homerooms I am responsible for', function () {
      cy.get('#homeroom-select').should('have.value', 'hea-500')

      // Switch to HEA-501
      cy.get('#homeroom-select').select('hea-501', { force: true })
      cy.get('#homeroom-select').should('have.value', 'hea-501')
      cy.url().should('contain', '/homerooms/hea-501')

      // Switch back to HEA-500
      cy.get('#homeroom-select').select('hea-500', { force: true })
      cy.get('#homeroom-select').should('have.value', 'hea-500')
      cy.url().should('contain', '/homerooms/hea-500')
    })

    it('don’t have access to restricted notes', function () {
      cy.visit(this.urls.studentWithRestrictedNote)

      cy.url().should('contain', '/not_authorized') // Redirects to a non_authorized page
      cy.get('div.info-area').should('contain', "You don't have the correct authorization for this page.")
        .and('contain', "Please check with the principal or school secretary if you feel this is incorrect.")
    })

    it('can customize which columns are visible in my homerooms’ rosters views', function () {
      cy.get('#column-picker-toggle').click()

      cy.get('input[type="checkbox"][name="name"]').uncheck()
      cy.get('span').contains('Name').should('not.be.visible')
      cy.get('input[type="checkbox"][name="risk"]').uncheck()
      cy.get('span').contains('Risk').should('not.be.visible')
      cy.get('input[type="checkbox"][name="program"]').uncheck()
      cy.get('span').contains('Program Assigned').should('not.be.visible')
      cy.get('input[type="checkbox"][name="language"]').uncheck()
      cy.get('p').contains('Language').should('not.be.visible')
      cy.get('input[type="checkbox"][name="free-reduced"]').uncheck()
      cy.get('span').contains('Free/Reduced Lunch').should('not.be.visible')
      cy.get('input[type="checkbox"][name="star_math"]').uncheck()
      cy.get('p').contains('STAR: Math').should('not.be.visible')
      cy.get('input[type="checkbox"][name="star_reading"]').uncheck()
      cy.get('p').contains('STAR: Reading').should('not.be.visible')
      cy.get('input[type="checkbox"][name="mcas_math"]').uncheck()
      cy.get('p').contains('MCAS: Math').should('not.be.visible')

      cy.get('input[type="checkbox"][name="name"]').check()
      cy.get('span').contains('Name').should('be.visible')
      cy.get('input[type="checkbox"][name="name"]').uncheck()
      cy.get('input[type="checkbox"][name="risk"]').check()
      cy.get('span').contains('Risk').should('be.visible')
      cy.get('input[type="checkbox"][name="risk"]').uncheck()
      cy.get('input[type="checkbox"][name="program"]').check()
      cy.get('span').contains('Program Assigned').should('be.visible')
      cy.get('input[type="checkbox"][name="program"]').uncheck()
      cy.get('input[type="checkbox"][name="language"]').check()
      cy.get('p').contains('Language').should('be.visible')
      cy.get('input[type="checkbox"][name="language"]').uncheck()
      cy.get('input[type="checkbox"][name="free-reduced"]').check()
      cy.get('span').contains('Free/Reduced Lunch').should('be.visible')
      cy.get('input[type="checkbox"][name="free-reduced"]').uncheck()
      cy.get('input[type="checkbox"][name="star_math"]').check()
      cy.get('p').contains('STAR: Math').should('be.visible')
      cy.get('input[type="checkbox"][name="star_math"]').uncheck()
      cy.get('input[type="checkbox"][name="star_reading"]').check()
      cy.get('p').contains('STAR: Reading').should('be.visible')
      cy.get('input[type="checkbox"][name="star_reading"]').uncheck()
      cy.get('input[type="checkbox"][name="mcas_math"]').check()
      cy.get('p').contains('MCAS: Math').should('be.visible')
      cy.get('input[type="checkbox"][name="mcas_math"]').uncheck()

      cy.get('input[type="checkbox"][name="sped"]').uncheck() // Bug in unchecking SPED & Disability
      cy.get('p').contains('SPED & Disability').should('not.be.visible')
      cy.get('input[type="checkbox"][name="sped"]').check()
      cy.get('p').contains('SPED & Disability').should('be.visible')
    })

    it('can record a Reading Intervention', function () {
      cy.get('tr.student-row:first-child td:first-child').click()
      cy.url().should('contain', '/students')
      cy.get('div.interventions-column').click()
      cy.get('button.btn.record-service').click()
      cy.get('button.btn.service-type').contains('Reading intervention').click()
      cy.get('input.ProvidedByEducatorDropdown').click()
      cy.get('input.ProvidedByEducatorDropdown').type('Doe, Jane')
      cy.get('input.datepicker.hasDatepicker').click()
      cy.get('span.ui-icon.ui-icon-circle-triangle-w').click()
      cy.get('a.ui-state-default').contains(moment().format('D')).click()
      cy.get('button').contains('Record service').click()

      cy.get('input.ProvidedByEducatorDropdown').should('not.be.visible')
      cy.get('input.datepicker.hasDatepicker').should('not.be.visible')
      cy.get('div.ServicesList div:first-child').should('contain', 'Reading intervention')
        .and('contain', 'With Doe, Jane')
        .and('contain', 'a month')
      cy.get('div.ServicesList div:first-child button').contains('Discontinue').should('be.visible')
    })

    it('can discontinue a Reading Intervention', function () {
      cy.visit(this.urls.studentWithReadingIntervention)
      cy.get('div.ServicesList div:first-child button').contains('Discontinue').click()
      cy.get('div.ServicesList div:first-child button').contains('Confirm').click()

      cy.get('div.ServicesList div:first-child button').contains('Discontinue').should('not.be.visible')
      cy.get('div.ServicesList div:first-child').should('contain', 'Reading intervention')
        .and('contain', 'With Doe, Jane')
        .and('contain', 'a month')
        .and('contain', 'Discontinued')
    })

    it('can look up a student by name', function () {
      cy.get('tr.student-row:first-child td.name:first-child a').then(($el) => {
        let studentName = $el.text().trim()
        cy.get('#student-searchbar').click()
        cy.get('#student-searchbar').type(studentName)

        cy.get('.ui-autocomplete.ui-front.ui-menu.ui-widget.ui-widget-content').should('contain', studentName)
        cy.get('.ui-autocomplete.ui-front.ui-menu.ui-widget.ui-widget-content').contains(studentName).click()
        cy.url().should('contain', '/students')
      })
    })

  })


})
