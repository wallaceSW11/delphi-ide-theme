program SampleProgram;

{$APPTYPE CONSOLE}
{$R *.res}

uses
  System.SysUtils,
  System.Classes,
  Everything in 'Everything.pas';

var
  Person: TPerson;
  Employee: TEmployee;
  Service: TDatabaseService;
  I: Integer;
  Sum: Double;
  Values: TArray<Integer>;

begin
  try
    WriteLn('=== Delphi 11 Theme Sample Program ===');
    WriteLn('');

    Person := TPerson.Create('Alice', 28);
    try
      WriteLn(Person.Introduce('Hi'));
    finally
      Person.Free;
    end;

    Employee := TEmployee.Create('Bob', 42, 'Engineering');
    try
      Employee.HireDate := EncodeDate(2018, 3, 15);
      WriteLn(Employee.Introduce('Hello'));
      WriteLn(Format('Years of service: %d', [Employee.YearsOfService]));
      WriteLn(Format('Is senior: %s', [BoolToStr(Employee.IsSenior, True)]));
    finally
      Employee.Free;
    end;

    Service := TDatabaseService.Create('db.example.com:5432');
    try
      Service.Execute;
    finally
      Service.Free;
    end;

    SetLength(Values, 10);
    for I := 0 to High(Values) do
      Values[I] := I * I;

    Sum := 0.0;
    for I in Values do
      Sum := Sum + I;

    WriteLn(Format('Sum of squares: %.0f', [Sum]));
    WriteLn('');

    WriteLn('Program completed successfully.');
  except
    on E: Exception do
      WriteLn('Error: ' + E.Message);
  end;
end.
