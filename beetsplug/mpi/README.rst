mpi
===

To start the web interface run ``beet mpi``.

Developer
---------

To run and debug the application in PyCharm you can use the following configuration.

* open `Run/Debug Configurations`
* create new Python script configuration
* Script Path: ``<ProjectDir>\beets``
* Parameters: ``mpi``
* Environment Variables: `PYTHONUNBUFFERED=1;FLASK_DEBUG=1;FLASK_ENV=development`